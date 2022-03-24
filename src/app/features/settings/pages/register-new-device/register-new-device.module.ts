import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegisterNewDevicePageRoutingModule } from './register-new-device-routing.module';

import { RegisterNewDevicePage } from './register-new-device.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegisterNewDevicePageRoutingModule
  ],
  declarations: [RegisterNewDevicePage]
})
export class RegisterNewDevicePageModule {}
