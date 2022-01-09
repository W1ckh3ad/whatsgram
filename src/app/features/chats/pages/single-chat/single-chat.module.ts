import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SingleChatPageRoutingModule } from './single-chat-routing.module';

import { SingleChatPage } from './single-chat.page';
import { ChatFooterComponent } from '../../components/chat-footer/chat-footer.component';
import { ChatMessageComponent } from '../../components/chat-message/chat-message.component';
import { ApplicationPipesModule } from 'src/app/shared/shared.module';
import { ObserveVisibilityDirective } from 'src/app/directives/observeVisibility/observe-visibility.directive';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SingleChatPageRoutingModule,
    ApplicationPipesModule,
  ],
  declarations: [
    SingleChatPage,
    ChatFooterComponent,
    ChatMessageComponent,
    ObserveVisibilityDirective,
  ],
})
export class SingleChatPageModule {}
