import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '@services/auth/auth.service';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  isVerified: boolean = false;
  showNav: boolean = true;
  private routeSub: Subscription;
  private authSub: Subscription;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.addAuthEventlistener();
    this.addRouteEventlistener();
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
    this.authSub.unsubscribe();
  }

  private addAuthEventlistener() {
    const user = this.authService.user;
    this.isLoggedIn = !!user;
    if (this.isLoggedIn) {
      this.isVerified = user.emailVerified;
    }
    this.authSub = this.authService.user$.subscribe((cred) => {
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
