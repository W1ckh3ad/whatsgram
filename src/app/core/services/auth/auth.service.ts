import { Injectable } from '@angular/core';
import {
  Auth,
  AuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  Unsubscribe,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatusSub$ = new BehaviorSubject<User>(null);
  private authSub: Unsubscribe;
  constructor(private auth: Auth, private router: Router) {
    this.authStatusListener();
  }

  ngOnDestroy() {
    this.authSub();
  }

  get user() {
    return this.authStatusSub$.value;
  }

  get user$() {
    return this.authStatusSub$;
  }

  public sendPasswordResetEmail(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<[User, Error]> {
    try {
      const { user } = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      return [user, null];
    } catch (error) {
      console.log('signInWithEmailAndPassword error', error);
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
    try {
      await signOut(this.auth);
      this.router.navigateByUrl('/sign-in');
    } catch (error) {
      console.error('signOut error', error);
      throw error;
    }
  }

  private authStatusListener() {
    this.authSub = onAuthStateChanged(this.auth, (credential) => {
      this.authStatusSub$.next(credential ?? null);
      if (credential) {
        if (credential.emailVerified) {
          if (window.location.pathname === '/sign-in') {
            const url = this.router.url;
            if (url.includes('returnUrl=')) {
              return this.router.navigateByUrl(
                new URLSearchParams(url.split('?')[1]).get('returnUrl')
              );
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
