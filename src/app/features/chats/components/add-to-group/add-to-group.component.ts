import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { SortedContactsPart } from '@models/sortedContacts.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AccountService } from '@services/account/account.service';
import { GroupService } from '@services/group/group.service';
import { sortContactsIntoLetterSegments } from '@utils/contacts.utils';
import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs';

@Component({
  selector: 'app-add-to-group',
  templateUrl: './add-to-group.component.html',
  styleUrls: ['./add-to-group.component.scss'],
})
export class AddToGroupComponent implements OnInit {
  @Input() groupId: string = null;
  @Input() membersLength: number = 0;
  maxMemberCount = 20;
  addedMembers: WhatsgramUser[] = [];
  contacts$: Observable<SortedContactsPart[]> = null;
  search$ = new BehaviorSubject('');
  constructor(
    private modalController: ModalController,
    private accountService: AccountService,
    private groupService: GroupService
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

  async dismissModal() {
    await this.modalController.dismiss();
  }

  handleClick(e, contact) {
    const index = this.addedMembers.indexOf(contact);
    if (e.detail.checked && index === -1) {
      this.addedMembers.push(contact);
    } else if (!e.detail.checked && index !== -1) {
      this.addedMembers.splice(index, 1);
    }
  }

  async onSubmit() {
    await this.groupService.addMembers(this.addedMembers, this.groupId);
    this.dismissModal();
  }

  onSearch(e) {
    this.search$.next(e.target.value.toLowerCase());
  }
}
