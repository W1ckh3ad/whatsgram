import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChatsPage } from './chats.page';

const routes: Routes = [
  {
    path: '',
    component: ChatsPage,
  },
  {
    path: ':id',
    loadChildren: () =>
      import('./pages/single-chat/single-chat.module').then(
        (m) => m.SingleChatPageModule
      ),
  },
  {
    path: ':id/group',
    loadChildren: () =>
      import('./pages/group/group.module').then((m) => m.GroupPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatsPageRoutingModule {}
