import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '@shared/shared.module';
import { ContactComponent } from './components/contact/contact.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { SearchComponent } from './components/search/search.component';
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
    SearchComponent,
    SearchResultComponent,
    ContactComponent,
  ],
})
export class ContactsPageModule {}
