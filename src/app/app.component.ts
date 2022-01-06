import { Component, OnDestroy, OnInit } from '@angular/core';
import { Auth, Unsubscribe, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private authStatusSub = new BehaviorSubject<User>(null);
  showNav = true;
  authSub: Unsubscribe;
  constructor(
    private auth: Auth,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.authStatusListener();
    let { value: theme } = await Storage.get({ key: 'theme' });
    if (theme == null) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    document.body.classList.add(theme);
  }

  ngOnDestroy(): void {
    this.authSub();
  }

  private authStatusListener() {
    this.authSub = this.auth.onAuthStateChanged((credential) => {
      if (credential) {
        if (credential.emailVerified) {
          this.authStatusSub.next(credential);
          if (window.location.pathname === '/sign-in') {
            this.router.navigateByUrl('/chats');
          }
        } else {
          this.router.navigateByUrl('/verify-email');
        }
      } else {
        this.authStatusSub.next(null);
        if (window.location.href !== '/sign-in') {
          this.router.navigateByUrl('/sign-in');
        }
      }
    });
  }
}
