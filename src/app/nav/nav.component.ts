import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';
import {
  Router,
  NavigationStart,
  Event,
  ActivatedRoute,
} from '@angular/router';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isLoggedIn = false;
  isVerified = false;
  showNav = true;
  constructor(private user: UserService, private router: Router) {
    this.isLoggedIn = !!user.auth.currentUser;
    if (this.isLoggedIn) {
      this.isVerified = user.auth.currentUser.emailVerified;
    }
    this.user.auth.onAuthStateChanged((cred) => {
      this.isLoggedIn = !!cred;
      if (this.isLoggedIn) {
        this.isVerified = cred.emailVerified;
      } else {
        this.isVerified = false;
      }
    });
    this.addRouteEventlistener();
  }

  ngOnInit() {}

  private addRouteEventlistener() {
    this.router.events.subscribe((x: Event) => {
      if (x instanceof NavigationStart) {
        if (x.url.match('/chats/[a-zA-Z0-9]+')) {
          this.showNav = false;
          console.log('hide');
        } else {
          this.showNav = true;
          console.log('show');
        }
      }
    });
  }
}
