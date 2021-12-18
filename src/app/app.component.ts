import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private authStatusSub = new BehaviorSubject<User>(null);
  constructor(private auth: Auth, private router: Router) {}

  async ngOnInit() {
    let { value: theme } = await Storage.get({ key: 'theme' });
    if (theme == null) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    document.body.classList.add(theme);
  }

  private authStatusListener() {
    this.auth.onAuthStateChanged((credential) => {
      if (credential) {
        if (credential.emailVerified) {
          console.log(credential);
          this.authStatusSub.next(credential);
          console.log('User is logged in');
        } else {
          console.log("User Mail isn't verified");
          this.router.navigateByUrl('/verify-email');
        }
      } else {
        this.authStatusSub.next(null);
        if (window.location.href !== '/login') {
          this.router.navigateByUrl('/login');
        }
        console.log('User is logged out');
      }
    });
  }
}
