import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { SignUp } from './sign-up.model';
import { sendEmailVerification } from 'firebase/auth';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  model = new SignUp('', '', '');
  submitted = false;
  errorMessage = '';

  constructor(private auth: Auth, private router: Router) {}

  onSubmit() {
    if (this.model.confirmPassword !== this.model.password) {
      return (this.errorMessage =
        'Passwort & Passwortbestätigung stimmen nicht über ein');
    }
    this.emailSignup(this.model.email, this.model.password);
  }

  ngOnInit() {}

  async emailSignup(email: string, password: string) {
    try {
      const res = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      await sendEmailVerification(res.user);
      this.router.navigateByUrl('/settings/profile');
    } catch (error) {
      console.error('Something went wrong: ', error);
    }
  }
}
