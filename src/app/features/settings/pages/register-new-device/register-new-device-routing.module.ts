import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterNewDevicePage } from './register-new-device.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterNewDevicePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterNewDevicePageRoutingModule {}
