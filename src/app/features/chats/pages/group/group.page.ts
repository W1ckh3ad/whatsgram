import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActionSheetController,
  AlertController,
  ModalController
} from '@ionic/angular';
import { Chat } from '@models/chat.model';
import { DocumentBase } from '@models/document-base.model';
import { GroupMember } from '@models/group-member';
import { SortedContactsPart } from '@models/sortedContacts.model';
import { AccountService } from '@services/account/account.service';
import { AuthService } from '@services/auth/auth.service';
import { ChatService } from '@services/chat/chat.service';
import { GroupService } from '@services/group/group.service';
import { sortContactsIntoLetterSegments } from '@utils/contacts.utils';
import { BehaviorSubject, combineLatestWith, map, Observable, tap } from 'rxjs';
import { AddToGroupComponent } from '../../components/add-to-group/add-to-group.component';
import { EditDescriptionComponent } from '../../components/edit-description/edit-description.component';
import { EditDisplayNameComponent } from '../../components/edit-display-name/edit-display-name.component';
import { EditPhotoUrlComponent } from '../../components/edit-photo-url/edit-photo-url.component';

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
    private alertController: AlertController,
    private modalController: ModalController,
    private accountService: AccountService,
    private router: Router
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
      initialBreakpoint: 0.6,
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
            this.groupService.toggleAdmin(
              member.isAdmin,
              this.groupId,
              member.id
            );
          },
        },
        {
          text: 'Aus Gruppe entfernen',
          role: 'destructive',
          cssClass: 'red',
          handler: () => {
            this.groupService.removeMember(this.groupId, member.id);
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

  async remove() {
    if (!this.isAdmin) return;
    let alert = await this.alertController.create({
      header: 'Gruppe löschen',

      buttons: [
        {
          text: 'Löschen bestätigen',
          role: 'destructive',
          cssClass: 'red',
          handler: async () => {
            await this.groupService.removeGroup(this.groupId);
            this.router.navigateByUrl('/chats');
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

    await alert.present();
  }

  async changeDisplayName(displayName: string) {
    const modal = await this.modalController.create({
      component: EditDisplayNameComponent,
      initialBreakpoint: 0.6,
      breakpoints: [0.4, 0.6, 0.9],
      componentProps: {
        displayName,
        groupId: this.groupId,
      },
    });

    await modal.present();
  }

  async changeDescription(description?: string) {
    const modal = await this.modalController.create({
      component: EditDescriptionComponent,
      initialBreakpoint: 0.6,
      breakpoints: [0.4, 0.6, 0.9],
      componentProps: {
        description,
        groupId: this.groupId,
      },
    });

    await modal.present();
  }
  async changePhotoURL(photoURL?: string) {
    const modal = await this.modalController.create({
      component: EditPhotoUrlComponent,
      initialBreakpoint: 0.6,
      breakpoints: [0.4, 0.6, 0.9],
      componentProps: {
        photoURL,
        groupId: this.groupId,
      },
    });

    await modal.present();
  }
}
