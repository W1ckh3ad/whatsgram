import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  constructor(private auth: AuthService) {}
  email: string = '';
  async ngOnInit() {}

  async forgotPassword() {
    await this.auth.sendPasswordResetEmail(this.email);
  }
}
