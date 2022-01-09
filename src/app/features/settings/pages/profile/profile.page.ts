import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountService } from 'src/app/services/account/account.service';
import { WhatsgramUser } from 'src/app/services/account/whatsgram.user.model';
import { UserEdit } from '../../services/account/user-edit.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  model = new UserEdit('', '', '', '');
  submitted = false;
  subscription: Subscription = null;
  constructor(private account: AccountService) {}
  // phoneNumber regex validation
  async ngOnInit() {
    this.subscription = this.account.user
      .pipe(
        map((x) =>
          x
            ? x
            : ({
                displayName: '',
                phoneNumber: '',
                photoURL: '',
                description: '',
              } as WhatsgramUser)
        )
      )
      .subscribe(
        (data) =>
          (this.model = new UserEdit(
            data.displayName ?? '',
            data.phoneNumber ?? '',
            data.photoURL ?? '',
            data.description ?? ''
          ))
      );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async onSubmit() {
    this.submitted = true;
    await this.account.updateProfile(this.model);
  }
}
