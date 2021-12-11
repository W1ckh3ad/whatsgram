import { Injectable, Optional } from '@angular/core';
import {
  Auth,
  authState,
  signInAnonymously,
  signOut,
  User,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(@Optional() private auth: Auth, private router: Router) {}

  getUser() {
    return this.auth.currentUser;
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((value) => {
        console.log('Nice, it worked!');
        this.router.navigateByUrl('/profile');
      })
      .catch((err) => {
        console.log('Something went wrong: ', err.message);
      });
  }

  emailSignup(email: string, password: string) {
    createUserWithEmailAndPassword(this.auth, email, password)
      .then((value) => {
        console.log('Sucess', value);
        this.router.navigateByUrl('/profile');
      })
      .catch((error) => {
        console.log('Something went wrong: ', error);
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

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    });
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
