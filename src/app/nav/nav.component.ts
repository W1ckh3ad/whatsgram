import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import {
  Router,
  NavigationStart,
  Event,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { Unsubscribe } from '@angular/fire/auth';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  isVerified = false;
  showNav = true;
  routeSub: Subscription;
  authSub: Unsubscribe;
  constructor(private user: UserService, private router: Router) {}

  ngOnInit() {
    this.addAuthEventlistener();
    this.addRouteEventlistener();
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.authSub();
  }

  private addAuthEventlistener() {
    this.isLoggedIn = !!this.user.auth.currentUser;
    if (this.isLoggedIn) {
      this.isVerified = this.user.auth.currentUser.emailVerified;
    }
    this.authSub = this.user.auth.onAuthStateChanged((cred) => {
      this.isLoggedIn = !!cred;
      if (this.isLoggedIn) {
        this.isVerified = cred.emailVerified;
      } else {
        this.isVerified = false;
      }
    });
  }

  private addRouteEventlistener() {
    this.routeSub = this.router.events.subscribe((x: Event) => {
      if (x instanceof NavigationStart) {
        if (x.url.match('/chats/[a-zA-Z0-9]+')) {
          this.showNav = false;
        } else {
          this.showNav = true;
        }
      }
    });
  }
}
