import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleChatPageRoutingModule } from './single-chat-routing.module';

import { SingleChatPage } from './single-chat.page';
import { ChatFooterComponent } from '../chat-footer/chat-footer.component';
import { PromiseComponent } from 'src/app/promise/promise.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleChatPageRoutingModule,
  ],
  declarations: [SingleChatPage, ChatFooterComponent, PromiseComponent],
})
export class SingleChatPageModule {}
