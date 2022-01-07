import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserService } from 'src/app/services/user/user.service';
import { AccountService } from 'src/app/services/account/account.service';
import { Observable } from 'rxjs';
import { WhatsgramUser } from 'src/app/services/account/whatsgram.user.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  users: Observable<WhatsgramUser[]>;
  search = '';
  contacts$: Observable<string[]>;

  constructor(
    public modalController: ModalController,
    private user: UserService,
    private account: AccountService
  ) {}

  async ngOnInit() {
    this.contacts$ = this.account.privateData.pipe(
      map((x) => x.contactRefs.map((y) => y.path.split('/')[1]))
    );
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
