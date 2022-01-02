import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { getPhotoURL } from 'src/utils';
import { AccountService } from '../services/account/account.service';
import { PrivateData } from '../services/account/private-data.model';
import { User } from '../services/account/user.model';
import { FirestoreService } from '../services/firestore/firestore.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  user: Observable<User>;
  privateData: Observable<PrivateData>;
  chats: Observable<User>[];
  getPhotoURL = getPhotoURL;

  constructor(private account: AccountService, private db: FirestoreService) {
    this.user = account.load();
    this.user.subscribe((x) => {
      this.privateData = this.db.doc$(x.privateData);
      this.privateData.subscribe((y) => {
        this.chats = Object.keys(y.chats)
          // .map((z) => ({ uid: z, updatedAt: y.chats[z].updatedAt }))
          // .sort((a, b) => a.updatedAt - b.updatedAt)
          .map((z) => this.db.doc$(this.db.getUsersDoc(z)));
      });
    });
  }

  ngOnInit() {}
}
