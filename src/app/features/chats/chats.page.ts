import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService } from '@services/chat/chat.service';
import { ScrollHideConfig } from '@shared/directives/scrollHide/scroll-hide.directive';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CreateGroupComponent } from './components/create-group/create-group.component';
import { ChatForDisplay } from './model/chat-for-display.model';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  chats$: Observable<ChatForDisplay[]>;
  privateKey: CryptoKey;
  headerScrollConfig: ScrollHideConfig = {
    cssProperty: 'margin-top',
    maxValue: 154,
  };

  private search$ = new BehaviorSubject('');

  constructor(
    private chat: ChatService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.chats$ = this.chat.loadChats().pipe(
      tap((x) => console.log(x)),
      map((x) =>
        x.map(
          (x) =>
            ({
              displayName: 'Dummy',
              photoURL: 'F',
              id: x.id,
              unread: 5,
              lastMessage: {
                createdAt: x.createdAt,
                isRead: true,
                text: '80a374d4979918ca61c556c622a2830d2c8eb257b5eeffbe54b12c17f76cdd1605e611a1def79e616e80ab3c1c99d15f40d0b315511bb4bdfd96ed6d7abab1fb148162e4ca51e5937cf35cf2670bf516b85236c1a4036ee0a6808e2cfbda22c8e150b37298db9c559cfbc229ac74013aac2a3b90e0f50534d7369cc453e0c8e48452ac666d95fd3d32bc299ca82473a1199fa1d61502d9487c91eee56a31f332dccfe59e0e66d48944006a6f8b947a93d31f4cd0e17837a6202459224e24fc7423d64f71c0681fcdbbc060b6065c498d8d4cabed1ed801d273e91d49f893d442d10cedea16a0f8ecae072ccbd4d8ea4bdce7d853b8d90555c63b6e0e4541e1e1',
              },
            } as ChatForDisplay)
        )
      )
    );
  }

  async onSearch(event) {
    this.search$.next(event.target.value.toLowerCase());
  }

  async openCreateGroupChat() {
    const modal = await this.modalController.create({
      component: CreateGroupComponent,
      initialBreakpoint: 0.6,
      breakpoints: [0, 0.2, 0.6, 1],
    });
    return await modal.present();
  }
}
