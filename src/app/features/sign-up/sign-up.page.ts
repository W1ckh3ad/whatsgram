import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { RouteHandlerServiceService } from '@services/routeHanderService/route-handler-service.service';
import { SignUp } from './models/sign-up.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  model = new SignUp('', '', '');
  submitted = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private routeHandlerService: RouteHandlerServiceService,

  ) {}

  async onSubmit() {
    if (this.model.confirmPassword !== this.model.password) {
      return (this.errorMessage =
        'Passwort & Passwortbestätigung stimmen nicht über ein');
    }
    await this.authService.emailSignup(
      this.model.email,
      this.model.password
    );
    await this.authService.signOut();
    return this.routeHandlerService.handleAuthAction("verify-email");
  }

  ngOnInit() {}
}
