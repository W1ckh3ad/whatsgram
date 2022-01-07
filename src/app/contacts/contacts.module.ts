import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContactsPageRoutingModule } from './contacts-routing.module';

import { ContactsPage } from './contacts.page';
import { SearchComponent } from './search/search.component';
import { UserComponent } from './user/user.component';
import { ApplicationPipesModule } from '../application-pipes/application-pipes.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactsPageRoutingModule,
    ApplicationPipesModule,
  ],
  declarations: [ContactsPage, SearchComponent, UserComponent],
})
export class ContactsPageModule {}
