import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { AccountService } from 'src/app/services/account/account.service';
import { Account } from 'src/app/services/account/account.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  users: Observable<Account[]>;
  search = '';
  contacts;

  @Input() currentUser: Observable<Account>;
  constructor(
    public modalController: ModalController,
    private user: UserService,
    private account: AccountService
  ) {}

  async ngOnInit() {
    this.currentUser.subscribe((x) => (this.contacts = x.privateData.contacts));
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
