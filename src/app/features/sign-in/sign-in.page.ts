import { Component, OnInit } from '@angular/core';
import { AuthAction } from '@models/auth-action.type';
import { AccountService } from '@services/account/account.service';
import { AuthService } from '@services/auth/auth.service';
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';
import { FirebaseCloudMessagingService } from '@services/firebaseCloudMessaging/firebase-cloud-messaging.service';
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
    private routeHandlerService: RouteHandlerServiceService,
    private cryptoKeysService: CryptoKeysService,
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
        const keys = await generateKeys();
        const { privateKey, publicKey } = await exportKeys(keys);
        this.cryptoKeysService.privateKey = keys.privateKey;
        this.accountService.publicKey$.next(keys.publicKey);
        await Promise.all([
          this.accountService.create(user, publicKey),
          this.cryptoKeysService.savePrivateKey(privateKey),
        ]);
        this.fcmService.getToken(true);
        return 'set-up-profile';
      }
      return 'verify-email';
    }
    if (!this.cryptoKeysService.privateKey) {
      return 'no-pk';
    }
    await this.fcmService.getToken();
    return 'go';
  }
}
