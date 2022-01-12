import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '@services/account/account.service';
import { AuthService } from '@services/auth/auth.service';
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
    private router: Router,
    private auth: AuthService,
    private account: AccountService
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
      await this.createIfDoesntExistsAndRedirect(user);
    } else if (error) {
      this.errorMessage = error.message;
    }
  }

  private async createIfDoesntExistsAndRedirect(user: User) {
    const { emailVerified } = user;
    if (this.account.uid$.value === null) {
      this.account.uid$.next(user.uid);
    }
    if (!(await this.account.exists())) {
      if (emailVerified) {
        this.account.create(user);
        return this.router.navigateByUrl('/settings/profile');
      }
      return this.router.navigateByUrl('/verify-email');
    }
    return this.router.navigateByUrl('/chats');
  }
}
