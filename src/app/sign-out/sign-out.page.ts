import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { signOut } from 'firebase/auth';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.page.html',
  styleUrls: ['./sign-out.page.scss'],
})
export class SignOutPage implements OnInit {
  constructor(private user: UserService, private router: Router) {}

  async ngOnInit() {
    await signOut(this.user.auth);
    this.router.navigateByUrl('sign-in');
  }
}
