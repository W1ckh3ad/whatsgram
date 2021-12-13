import { Component, OnInit } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  signInWithPopup,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  User,
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  constructor(
    private auth: Auth,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    if (this.auth.currentUser) {
      this.save();
      this.router.navigateByUrl('/chats');
    }
  }

  save() {
    const { displayName, photoURL, uid, phoneNumber, email } =
      this.auth.currentUser;
    this.userService.saveUser({
      displayName,
      uid,
      photoURL,
      publicKey: 'asda',
      phoneNumber,
      email,
    });
  }

  login(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((value) => {
        console.log('Nice, it worked!');
        this.save();
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
      this.save();
      console.log('Sucess', value), this.router.navigateByUrl('/chats');
    } catch (error) {
      console.log('Something went wrong: ', error);
    }
  }
}
