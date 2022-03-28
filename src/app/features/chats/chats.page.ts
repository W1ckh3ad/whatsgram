import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ChatService } from '@services/chat/chat.service';
import { ScrollHideConfig } from '@shared/directives/scrollHide/scroll-hide.directive';
import { BehaviorSubject, combineLatestWith, map, Observable } from 'rxjs';
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
    private chatService: ChatService,
    private modalController: ModalController
  ) {}

  async ngOnInit() {
    this.chats$ = this.chatService.loadChats$().pipe(
      combineLatestWith(this.search$),
      map(([chats, search]) =>
        chats.filter((y) => y.info.displayName.toLowerCase().includes(search))
      )
    );
  }

  async onSearch(event) {
    this.search$.next(event.target.value.toLowerCase());
  }

  async openCreateGroupChat() {
    const modal = await this.modalController.create({
      component: CreateGroupComponent,
      initialBreakpoint: 1,
      breakpoints: [0, 0.2, 0.6, 1],
    });
    return await modal.present();
  }
}
