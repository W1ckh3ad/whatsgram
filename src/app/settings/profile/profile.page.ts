import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { UserEdit } from './user-edit.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  model = new UserEdit('', '', '', '');
  submitted = false;

  constructor(
    private router: Router,
    private user: UserService
  ) {
    console.log(user.auth);
    console.log(user.auth.currentUser);
  }

  async ngOnInit() {
    const data = await this.user.load(this.user.auth.currentUser.uid);
    console.log(data);
  }

  onSubmit() {
    this.submitted = true;
  }
}
