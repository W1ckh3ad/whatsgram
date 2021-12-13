import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Auth, createUserWithEmailAndPassword } from '@firebase/auth';
import { SignUp } from './sign-up.model';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  // constructor(private auth: Auth, private router: Router) {}
  model = new SignUp('Test', '', '');
  submitted = false;
  errorMessage = '';
  onSubmit() {
    if (this.model.confirmPassword !== this.model.password) {
      return (this.errorMessage =
        'Passwort & Passwortbestätigung stimmen nicht über ein');
    }
    this.submitted = true;
  }

  constructor() {}
  ngOnInit() {}

  // emailSignup(email: string, password: string) {
  //   createUserWithEmailAndPassword(this.auth, email, password)
  //     .then((value) => {
  //       console.log('Sucess', value);
  //       this.router.navigateByUrl('/chats');
  //     })
  //     .catch((error) => {
  //       console.log('Something went wrong: ', error);
  //     });
  // }
}
