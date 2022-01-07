import { Component, OnInit } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  constructor(private auth: Auth) {}
  email: string = '';
  async ngOnInit() {
  }

  forgotPassword() {
    sendPasswordResetEmail(this.auth, this.email);
  }
}
