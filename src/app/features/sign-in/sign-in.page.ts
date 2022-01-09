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
  ) {
    alert('instance');
  }

  ngOnInit() {}

  async login() {
    await this.handleLogin(
      this.auth.signInWithEmailAndPassword(
        this.model.email,
        this.model.password
      )
    );
  }

  googleLogin() {
    this.auth.googleLogin();
  }

  gitHubLogin() {
    this.auth.gitHubLogin();
  }

  twitterLogin() {
    this.auth.twitterLogin();
  }

  private async handleLogin(data: Promise<[User, Error]>) {
    const [user, error] = await data;
    if (user) {
      await this.createIfDoesntExistsAndRedirect(user);
    } else if (error) {
      this.errorMessage = error.message;
    }
  }

  private async createIfDoesntExistsAndRedirect(user: User) {
    const { emailVerified } = user;

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
