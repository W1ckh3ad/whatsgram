import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyEmailPage } from './verify-email.page';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [VerifyEmailPage],
})
export class VerifyEmailPageModule {}
