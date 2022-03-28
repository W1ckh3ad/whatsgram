import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SortedContactsPart } from '@models/sortedContacts.model';
import { AccountService } from '@services/account/account.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { UserService } from '@services/user/user.service';
import { ScrollHideConfig } from '@shared/directives/scrollHide/scroll-hide.directive';
import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs';
import { sortContactsIntoLetterSegments } from '@utils/contacts.utils';
import { AddComponent } from './components/add/add.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.page.html',
  styleUrls: ['./contacts.page.scss'],
})
export class ContactsPage implements OnInit {
  showSearch = false;
  private search$ = new BehaviorSubject('');
  contacts$: Observable<Array<SortedContactsPart>>;
  headerScrollConfig: ScrollHideConfig = {
    cssProperty: 'margin-top',
    maxValue: 154,
  };

  constructor(
    private accountService: AccountService,
    public modalController: ModalController,
    public dbService: FirestoreService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.contacts$ = this.accountService.contacts$.pipe(
      combineLatestWith(this.search$),
      map(([contacts, search]) =>
        contacts.filter(
          (y) =>
            y.displayName.toLowerCase().includes(search) ||
            y.email.toLowerCase().includes(search)
        )
      ),
      map(sortContactsIntoLetterSegments)
    );
  }

  async onSearch(event) {
    this.search$.next(event.target.value.toLowerCase());
  }

  async openAdd() {
    const modal = await this.modalController.create({
      component: AddComponent,
      initialBreakpoint: 1,
      breakpoints: [0, 0.2, 0.6, 1],
    });
    return await modal.present();
  }
}
