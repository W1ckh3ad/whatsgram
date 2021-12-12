import { Component, OnInit } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {}

  emailSignup(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((value) => {
        console.log('Sucess', value);
        this.router.navigateByUrl('/chats');
      })
      .catch((error) => {
        console.log('Something went wrong: ', error);
      });
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((value) => {
        console.log('Nice, it worked!');
        this.router.navigateByUrl('/chats');
      })
      .catch((err) => {
        console.log('Something went wrong: ', err.message);
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
      const value = await signInWithPopup(this.auth, provider);
      console.log('Sucess', value), this.router.navigateByUrl('/chats');
    } catch (error) {
      console.log('Something went wrong: ', error);
    }
  }
}
