import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { AccountService } from 'src/app/services/account/account.service';
import { UserService } from 'src/app/services/user/user.service';
import { UserEdit } from '../../services/account/user-edit.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  model = new UserEdit('', '', '', '');
  submitted = false;
  private uid;

  private authStatusSub = new BehaviorSubject<User>(null);

  constructor(private router: Router, private account: AccountService) {}
  // phoneNumber regex validation
  async ngOnInit() {
    const data = await this.account.load();
    this.model = new UserEdit(
      data.displayName,
      data.phoneNumber,
      data.photoURL,
      data.description
    );
  }

  async onSubmit() {
    this.submitted = true;
    await this.account.updateProfile(this.model);
  }
}
