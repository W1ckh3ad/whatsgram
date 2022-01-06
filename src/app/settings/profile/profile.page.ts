import { Component, OnInit } from '@angular/core';
import { AccountService } from 'src/app/services/account/account.service';
import { UserEdit } from '../../services/account/user-edit.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  model = new UserEdit('', '', '', '');
  submitted = false;


  constructor(
    private account: AccountService,
  ) {}
  // phoneNumber regex validation
  async ngOnInit() {
    const data = await this.account.loadSnapUser();

    this.model = new UserEdit(
      data.displayName ?? '',
      data.phoneNumber ?? '',
      data.photoURL ?? '',
      data.description ?? ''
    );
  }

  async onSubmit() {
    this.submitted = true;
    await this.account.updateProfile(this.model);
  }
}
