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
    private auth: AuthService,
    private account: AccountService,
    private routeHandler: RouteHandlerServiceService
  ) {}

  ngOnInit() {}

  async login() {
    await this.handleLogin(
      await this.auth.signInWithEmailAndPassword(
        this.model.email,
        this.model.password
      )
    );
  }

  async googleLogin() {
    await this.handleLogin(await this.auth.googleLogin());
  }

  async gitHubLogin() {
    await this.handleLogin(await this.auth.gitHubLogin());
  }

  async twitterLogin() {
    await this.handleLogin(await this.auth.twitterLogin());
  }

  private async handleLogin(data: [User, Error]) {
    const res = await data;
    console.log(data);
    const [user, error] = res;
    if (user) {
      const action = await this.account.createIfDoesntExistsAndGiveAction(user);
      return this.routeHandler.handleAuthAction(action);
    } else if (error) {
      this.errorMessage = error.message;
    }
  }
}
