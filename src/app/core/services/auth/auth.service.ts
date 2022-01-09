import { Injectable } from '@angular/core';
import {
  Auth,
  User,
  Unsubscribe,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  AuthProvider,
  signOut,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatusSub = new BehaviorSubject<User>(null);
  private authSub: Unsubscribe;
  constructor(private auth: Auth, private router: Router) {
    this.authStatusListener();
  }

  ngOnDestroy() {
    this.authSub();
  }

  get user() {
    return this.authStatusSub.value;
  }

  get user$() {
    return this.authStatusSub;
  }

  public sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<[User, Error]> {
    try {
      return [
        (await signInWithEmailAndPassword(this.auth, email, password)).user,
        null,
      ];
    } catch (error) {
      return [null, error];
    }
  }

  googleLogin() {
    return this.oAuthLogin(new GoogleAuthProvider());
  }

  gitHubLogin() {
    return this.oAuthLogin(new GithubAuthProvider());
  }

  twitterLogin() {
    return this.oAuthLogin(new TwitterAuthProvider());
  }

  async signOut() {
    await signOut(this.auth);
    this.router.navigateByUrl('/login');
  }

  private authStatusListener() {
    this.authSub = this.auth.onAuthStateChanged((credential) => {
      this.authStatusSub.next(credential ?? null);
      if (credential) {
        if (credential.emailVerified) {
          if (window.location.pathname === '/sign-in') {
            if (this.router.url.includes('returnUrl=')) {
              alert('returnURL');
            }
            this.router.navigateByUrl('/chats');
          }
        } else {
          this.router.navigateByUrl('/verify-email');
        }
      } else {
        if (window.location.href !== '/sign-in') {
          this.router.navigateByUrl('/sign-in');
        }
      }
    });
  }

  private async oAuthLogin(provider: AuthProvider): Promise<[User, Error]> {
    try {
      return [(await signInWithPopup(this.auth, provider)).user, null];
    } catch (error) {
      console.error('Something went wrong: ', error);
      return [null, error];
    }
  }
}
