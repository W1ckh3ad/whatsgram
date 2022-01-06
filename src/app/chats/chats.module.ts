import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsPageRoutingModule } from './chats-routing.module';

import { ChatsPage } from './chats.page';
import { DecryptPipe } from '../pipes/decrypt/decrypt.pipe';
import { PhotoUrlPipe } from '../pipes/photo-url/photo-url.pipe';
import { DocPipe } from '../pipes/doc/doc.pipe';
import { TimePipe } from '../pipes/time/time.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, ChatsPageRoutingModule],
  declarations: [ChatsPage, DecryptPipe, PhotoUrlPipe, DocPipe, TimePipe],
})
export class ChatsPageModule {}
