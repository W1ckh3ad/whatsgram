import { Component, OnInit } from '@angular/core';
import { AuthAction } from '@models/auth-action.type';
import { AccountService } from '@services/account/account.service';
import { AuthService } from '@services/auth/auth.service';
import { FirebaseCloudMessagingService } from '@services/firebaseCloudMessaging/firebase-cloud-messaging.service';
import { PrivateKeyService } from '@services/privateKey/private-key.service';
import { RouteHandlerServiceService } from '@services/routeHanderService/route-handler-service.service';
import { exportKeys, generateKeys } from '@utils/crypto.utils';
import { User } from 'firebase/auth';
import { SignIn } from './models/sign-in.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  model = new SignIn('', '');
  errorMessage = '';
  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private privateKeyService: PrivateKeyService,
    private routeHandlerService: RouteHandlerServiceService,
    private fcmService: FirebaseCloudMessagingService
  ) {}

  ngOnInit() {}

  async login() {
    await this.handleLogin(
      await this.authService.signInWithEmailAndPassword(
        this.model.email,
        this.model.password
      )
    );
  }

  async googleLogin() {
    await this.handleLogin(await this.authService.googleLogin());
  }

  async gitHubLogin() {
    await this.handleLogin(await this.authService.gitHubLogin());
  }

  async twitterLogin() {
    await this.handleLogin(await this.authService.twitterLogin());
  }

  private async handleLogin(data: [User, Error]) {
    const res = await data;
    const [user, error] = res;
    if (user) {
      const action = await this.createIfDoesntExistsAndGiveAction(user);
      return this.routeHandlerService.handleAuthAction(action);
    } else if (error) {
      this.errorMessage = error.message;
    }
  }

  private async createIfDoesntExistsAndGiveAction(
    user: User
  ): Promise<AuthAction> {
    const { emailVerified } = user;
    if (this.accountService.uid$.value === null) {
      this.accountService.uid$.next(user.uid);
    }
    if (!(await this.accountService.exists())) {
      if (emailVerified) {
        await this.create(user);
        return 'set-up-profile';
      }
      return 'verify-email';
    }
    await this.fcmService.getToken();
    return 'go';
  }

  private async create(user: User): Promise<void> {
    const { privateKey, publicKey } = await exportKeys(await generateKeys());
    await Promise.all([
      this.privateKeyService.savePrivateKey(privateKey),
      this.accountService.create(user, publicKey),
      this.fcmService.getToken(true),
    ]);
  }
}
