import { Component, OnInit } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AccountService } from '../services/account/account.service';
import { SignIn } from './sign-in.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
})
export class SignInPage implements OnInit {
  model = new SignIn('', '');
  errorMessage = '';
  constructor(
    private auth: Auth,
    private router: Router,
    private account: AccountService
  ) {}

  ngOnInit() {}

  login() {
    signInWithEmailAndPassword(this.auth, this.model.email, this.model.password)
      .then(() => {
        this.createIfDoesntExistsAndRedirect();
      })
      .catch((err) => {
        return (this.errorMessage = err.message);
      });
  }

  googleLogin() {
    this.oAuthLogin(new GoogleAuthProvider());
  }

  gitHubLogin() {
    this.oAuthLogin(new GithubAuthProvider());
  }

  twitterLogin() {
    this.oAuthLogin(new TwitterAuthProvider());
  }

  private async oAuthLogin(provider) {
    try {
      await signInWithPopup(this.auth, provider);
      this.createIfDoesntExistsAndRedirect();
    } catch (error) {
      console.error('Something went wrong: ', error);
    }
  }

  private async createIfDoesntExistsAndRedirect() {
    const { displayName, photoURL, uid, email, emailVerified } =
      this.auth.currentUser;

    if (!(await this.account.exists())) {
      if (emailVerified) {
        this.account.create(this.auth.currentUser);
        return this.router.navigateByUrl('/settings/profile');
      }
      return this.router.navigateByUrl('/verify-email');
    }
    return this.router.navigateByUrl('/chats');
  }

  toSignUp() {
    this.router.navigateByUrl('/sign-up');
  }
}
