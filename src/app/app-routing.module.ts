import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth/auth.guard';
import { ValidKeyGuard } from '@guards/validKey/valid-key.guard';
import { VerifiedGuard } from '@guards/verified/verified.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/chats',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./features/sign-in/sign-in.module').then(
        (m) => m.SignInPageModule
      ),
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./features/sign-up/sign-up.module').then(
        (m) => m.SignUpPageModule
      ),
  },
  {
    path: 'verify-email',
    loadChildren: () =>
      import('./features/verify-email/verify-email.module').then(
        (m) => m.VerifyEmailPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./features/forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
  },
  {
    path: 'sign-out',
    loadChildren: () =>
      import('./features/sign-out/sign-out.module').then(
        (m) => m.SignOutPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./features/settings/settings.module').then(
        (m) => m.SettingsPageModule
      ),
    canActivate: [AuthGuard, VerifiedGuard, ValidKeyGuard],
  },
  {
    path: 'chats',
    loadChildren: () =>
      import('./features/chats/chats.module').then((m) => m.ChatsPageModule),
    canActivate: [AuthGuard, VerifiedGuard, ValidKeyGuard],
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('./features/contacts/contacts.module').then(
        (m) => m.ContactsPageModule
      ),
    canActivate: [AuthGuard, VerifiedGuard, ValidKeyGuard],
  },
  {
    path: 'register-device',
    loadChildren: () =>
      import('./features/register-device/register-device.module').then(
        (m) => m.RegisterDevicePageModule
      ),
    canActivate: [AuthGuard, VerifiedGuard],
  },
  {
    path: '**',
    loadChildren: () =>
      import('./features/not-found/not-found.module').then(
        (m) => m.NotFoundPageModule
      ),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
