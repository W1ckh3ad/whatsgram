import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleChatPageRoutingModule } from './single-chat-routing.module';

import { SingleChatPage } from './single-chat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleChatPageRoutingModule
  ],
  declarations: [SingleChatPage]
})
export class SingleChatPageModule {}
