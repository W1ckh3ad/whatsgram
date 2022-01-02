import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { AccountService } from 'src/app/services/account/account.service';
import { Account } from 'src/app/services/account/account.model';
import { Observable } from 'rxjs';
import { User } from 'src/app/services/account/user.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  users: Observable<User[]>;
  search = '';
  @Input() contacts: Observable<Account>[];

  constructor(
    public modalController: ModalController,
    private user: UserService,
    private account: AccountService
  ) {}

  async ngOnInit() {
    console.log(this.contacts);
  }

  add(uid: string) {
    this.account.add(uid);
  }

  async onSubmit() {
    this.users = this.user.find(this.search);
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }
}
