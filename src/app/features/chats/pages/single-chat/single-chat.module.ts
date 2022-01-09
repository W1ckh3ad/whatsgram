import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ChatFooterComponent } from '../../components/chat-footer/chat-footer.component';
import { ChatMessageComponent } from '../../components/chat-message/chat-message.component';
import { SingleChatPageRoutingModule } from './single-chat-routing.module';
import { SingleChatPage } from './single-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleChatPageRoutingModule,
    SharedModule,
  ],
  exports: [SharedModule],
  declarations: [SingleChatPage, ChatFooterComponent, ChatMessageComponent],
})
export class SingleChatPageModule {}
