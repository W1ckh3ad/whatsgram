import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { ContactComponent } from './components/contact/contact.component';
import { AddSearchResultComponent } from './components/add-search-result/add-search-result.component';
import { AddComponent } from './components/add/add.component';
import { ContactsPageRoutingModule } from './contacts-routing.module';
import { ContactsPage } from './contacts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ContactsPageRoutingModule,
    SharedModule,
  ],
  exports: [IonicModule],
  declarations: [
    ContactsPage,
    AddComponent,
    AddSearchResultComponent,
    ContactComponent,
  ],
})
export class ContactsPageModule {}
