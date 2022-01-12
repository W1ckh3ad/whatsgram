import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyEmailPage } from './verify-email.page';
import { VerifyEmailPageRoutingModule } from './verify-email-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyEmailPageRoutingModule,
  ],
  declarations: [VerifyEmailPage],
})
export class VerifyEmailPageModule {}
