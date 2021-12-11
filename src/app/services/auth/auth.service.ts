import { Injectable } from '@angular/core';
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
} from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: Auth, private router: Router) {}

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
    const provider = new GoogleAuthProvider();
    return this.oAuthLogin(provider)
      .then((value) => {
        console.log('Sucess', value), this.router.navigateByUrl('/profile');
      })
      .catch((error) => {
        console.log('Something went wrong: ', error);
      });
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/']);
    });
  }

  private oAuthLogin(provider) {
    return signInWithPopup(this.auth, provider);
  }
}
