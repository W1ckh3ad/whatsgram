import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isLoggedIn = false;
  isVerified = false;
  constructor(private user: UserService) {
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
  }

  ngOnInit() {}
}
