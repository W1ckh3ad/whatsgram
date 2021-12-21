import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { getPhotoURL } from '../../../utils';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/services/user/user.service';
import { AccountService } from 'src/app/services/account/account.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  getPhotoURL = getPhotoURL;
  users = [];
  search = '';
  currentUser;
  constructor(
    public modalController: ModalController,
    private user: UserService,
    private account: AccountService
  ) {}

  async ngOnInit() {
    this.currentUser = await this.account.load();
  }

  async onSubmit() {
    const snap = await this.user.find(this.search);
    this.users = [];
    snap.forEach((x) => {
      const data = x.data();
      this.users.push(data);
    });
  }
}
