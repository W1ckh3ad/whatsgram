import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { sendEmailVerification } from 'firebase/auth';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {
  constructor(private auth: Auth) {}

  ngOnInit() {}

  resend() {
    sendEmailVerification(this.auth.currentUser);
  }
}
