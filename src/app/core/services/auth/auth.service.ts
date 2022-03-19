import { Injectable } from '@angular/core';
import {
  Auth,
  AuthProvider,
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  TwitterAuthProvider,
  Unsubscribe,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthAction } from '@models/auth-action.type';
import { RouteHandlerServiceService } from '@services/routeHanderService/route-handler-service.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authStatusSub$ = new BehaviorSubject<User>(null);
  private authSub: Unsubscribe;
  constructor(
    private auth: Auth,
    private router: Router,
    private routeHandler: RouteHandlerServiceService
  ) {
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

  sendEmailVerification() {
    return sendEmailVerification(this.user);
  }

  async emailSignup(email: string, password: string) {
    try {
      const res = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await sendEmailVerification(res.user);
      return res.user;
    } catch (error) {
      console.error('Something went wrong: ', error);
    }
  }

  private authStatusListener() {
    this.authSub = onAuthStateChanged(this.auth, (credential) => {
      this.authStatusSub$.next(credential ?? null);
      const action = this.getAuthAction(credential);
      return this.routeHandler.handleAuthAction(action);
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

  private getAuthAction(user: User): AuthAction {
    if (user) {
      if (user.emailVerified) {
        return 'go';
      } else {
        return 'verify-email';
      }
    } else {
      if (window.location.href !== '/sign-in') {
        return 'unauthorized';
      }
    }
  }
}
