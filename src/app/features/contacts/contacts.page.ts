import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DocumentBase } from '@models/document-base.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AccountService } from '@services/account/account.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { UserService } from '@services/user/user.service';
import {
  BehaviorSubject,
  combineLatestWith,
  map,
  Observable,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { AddComponent } from './components/add/add.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  showSearch = false;
  private search$ = new BehaviorSubject('');
  private contactsCache$: Observable<DocumentBase[]>;
  contacts$: Observable<(WhatsgramUser & DocumentBase)[]>;
  constructor(
    private account: AccountService,
    public modalController: ModalController,
    public db: FirestoreService,
    public user: UserService
  ) {}

  ngOnInit() {
    this.contactsCache$ = this.account.contacts$.pipe(shareReplay(1));
    this.contacts$ = this.contactsCache$.pipe(
      tap((x) => console.log('before load', x)),
      switchMap((x) => this.user.loadList(x.map((y) => y.id))),
      tap((x) => console.log('after load', x)),
      combineLatestWith(this.search$),
      tap((x) => console.log('after combine', x)),
      map(([contacts, search]) =>
        contacts.filter(
          (y) =>
            y.displayName.toLowerCase().includes(search) ||
            y.email.toLowerCase().includes(search)
        )
      ),
      tap((x) => console.log('after filter', x))
    );
  }

  async onSearch(event) {
    this.search$.next(event.target.value.toLowerCase());
  }

  async openAdd() {
    const modal = await this.modalController.create({
      component: AddComponent,
      cssClass: 'contacts-search',
    });
    return await modal.present();
  }
}
