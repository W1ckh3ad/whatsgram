import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  users = [];
  search = '';
  currentUser;
  constructor(
    public modalController: ModalController,
    private user: UserService,
    private account: AccountService
  ) {}

  async ngOnInit() {
    console.log(this);
  }

  add(uid: string) {
    this.account.add(uid);
  }

  async onSubmit() {
    const snap = await this.user.find(this.search);
    this.users = [];
    snap.forEach((x) => {
      const data = x.data();
      this.users.push(data);
    });
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }
}
