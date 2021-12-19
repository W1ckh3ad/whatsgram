import { Component, OnInit } from '@angular/core';
import { Auth, sendPasswordResetEmail } from '@angular/fire/auth';
import { signOut } from 'firebase/auth';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  constructor(private auth: Auth) {}
  email: string = '';
  async ngOnInit() {
    // await signOut(this.auth);
  }

  forgotPassword() {
    sendPasswordResetEmail(this.auth, this.email);
  }
}
