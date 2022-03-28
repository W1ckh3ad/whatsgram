import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isAdmin } from '@firebase/util';
import { ActionSheetController, ModalController } from '@ionic/angular';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { GroupMember } from '@models/group-member';
import { SortedContactsPart } from '@models/sortedContacts.model';
import { AccountService } from '@services/account/account.service';
import { AuthService } from '@services/auth/auth.service';
import { ChatService } from '@services/chat/chat.service';
import { FirestoreService } from '@services/firestore/firestore.service';
import { GroupService } from '@services/group/group.service';
import { sortContactsIntoLetterSegments } from '@utils/contacts.utils';
import { getGroupMemberDoc } from '@utils/db.utils';
import { BehaviorSubject, combineLatestWith, map, Observable, tap } from 'rxjs';
import { AddToGroupComponent } from '../../components/add-to-group/add-to-group.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.page.html',
  styleUrls: ['./group.page.scss'],
})
export class GroupPage implements OnInit {
  chat$: Observable<Chat & DocumentBase> = null;
  userId: string = null;
  members$: Observable<(GroupMember & DocumentBase)[]> = null;
  groupId: string = null;
  isAdmin: boolean = false;
  membersLength = 0;

  search$ = new BehaviorSubject('');
  contacts$: Observable<SortedContactsPart[]> = null;

  constructor(
    private activeRoute: ActivatedRoute,
    private chatService: ChatService,
    private authService: AuthService,
    private groupService: GroupService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private dbService: FirestoreService,
    private accountService: AccountService
  ) {}

  async ngOnInit() {
    this.groupId = this.activeRoute.snapshot.paramMap.get('id');
    this.chat$ = this.chatService.loadChat$(this.groupId);
    this.members$ = this.groupService.loadMembers$(this.groupId).pipe(
      tap((x) => {
        this.membersLength = x.length;
        this.isAdmin =
          x.findIndex((y) => y.id === this.userId && y.isAdmin) > -1;
      }),
      map((x) => x.sort((a, b) => a.displayName.localeCompare(b.displayName)))
    );
    this.userId = this.authService.user.uid;
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

  async add() {
    const modal = await this.modalController.create({
      component: AddToGroupComponent,
      initialBreakpoint: 0.9,
      breakpoints: [0.4, 0.6, 0.9],
      componentProps: {
        groupId: this.groupId,
        membersLength: this.membersLength,
      },
    });

    await modal.present();
  }

  async clickMember(member: GroupMember & DocumentBase) {
    if (member.id === this.authService.user.uid || !this.isAdmin) return;
    let actionSheet = await this.actionSheetController.create({
      header: member.displayName,

      buttons: [
        {
          text: member.isAdmin ? 'Adminstatus entfernen' : 'Zum Admin ernennen',
          handler: () => {
            this.dbService.setUpdate(
              getGroupMemberDoc(this.groupId, member.id),
              { isAdmin: !isAdmin },
              { merge: true }
            );
          },
        },
        {
          text: 'Aus Gruppe entfernen',
          role: 'destructive',
          cssClass: 'red',
          handler: () => {
            this.dbService.remove(getGroupMemberDoc(this.groupId, member.id));
          },
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });

    await actionSheet.present();
  }
}
