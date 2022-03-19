import { Component, OnInit } from '@angular/core';
import { AccountService } from '@services/account/account.service';
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
    private accountService: AccountService,
    private routeHandlerService: RouteHandlerServiceService
  ) {}

  async onSubmit() {
    if (this.model.confirmPassword !== this.model.password) {
      return (this.errorMessage =
        'Passwort & Passwortbestätigung stimmen nicht über ein');
    }
    const user = await this.authService.emailSignup(
      this.model.email,
      this.model.password
    );
    const action = await this.accountService.createIfDoesntExistsAndGiveAction(user);
    return this.routeHandlerService.handleAuthAction(action);
  }

  ngOnInit() {}
}
