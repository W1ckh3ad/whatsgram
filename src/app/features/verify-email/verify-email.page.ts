import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit, OnDestroy {
  isVerified = false;
  sub: Subscription;
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.auth.user.emailVerified) {
      this.router.navigateByUrl('/settings/profile');
    }
    this.sub = this.auth.user$.subscribe((x) => {
      if (this.auth.user.emailVerified) {
        this.router.navigateByUrl('/settings/profile');
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  resend() {
    this.auth.sendEmailVerification();
  }
}
