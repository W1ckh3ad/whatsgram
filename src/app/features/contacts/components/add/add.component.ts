import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DocumentBase } from '@models/document-base.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AccountService } from '@services/account/account.service';
import { UserService } from '@services/user/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-contacts-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.scss'],
})
export class AddComponent implements OnInit {
  users$: Observable<(WhatsgramUser & DocumentBase)[]>;
  search = '';
  contacts$: Observable<string[]>;

  constructor(
    public modalController: ModalController,
    private user: UserService,
    private account: AccountService
  ) {}

  async ngOnInit() {}

  add(uid: string) {
    this.account.add(uid);
  }

  async onSubmit() {
    this.users$ = this.user.find(this.search);
  }

  async dismissModal() {
    await this.modalController.dismiss();
  }
}
