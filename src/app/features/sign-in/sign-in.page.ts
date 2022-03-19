import { Component, OnInit } from '@angular/core';
import { AccountService } from '@services/account/account.service';
import { AuthService } from '@services/auth/auth.service';
import { RouteHandlerServiceService } from '@services/routeHanderService/route-handler-service.service';
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
    private routeHandlerService: RouteHandlerServiceService
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
      const action = await this.accountService.createIfDoesntExistsAndGiveAction(user);
      return this.routeHandlerService.handleAuthAction(action);
    } else if (error) {
      this.errorMessage = error.message;
    }
  }
}
