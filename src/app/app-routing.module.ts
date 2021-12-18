import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AnonymousGuard } from './guards/anonymous/anonymous.guard';
import { AuthGuard } from './guards/auth/auth.guard';
import { VerifiedGuard } from './guards/verified/verified.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/chats',
    pathMatch: 'full',
  },
  {
    path: 'sign-in',
    loadChildren: () =>
      import('./sign-in/sign-in.module').then((m) => m.SignInPageModule),
    canActivate: [AnonymousGuard],
  },
  {
    path: 'sign-up',
    loadChildren: () =>
      import('./sign-up/sign-up.module').then((m) => m.SignUpPageModule),
    canActivate: [AnonymousGuard],
  },
  {
    path: 'verify-email',
    loadChildren: () =>
      import('./verify-email/verify-email.module').then(
        (m) => m.VerifyEmailPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('./forgot-password/forgot-password.module').then(
        (m) => m.ForgotPasswordPageModule
      ),
    canActivate: [AnonymousGuard],
  },
  {
    path: 'sign-out',
    loadChildren: () =>
      import('./sign-out/sign-out.module').then((m) => m.SignOutPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'settings',
    loadChildren: () =>
      import('./settings/settings.module').then((m) => m.SettingsPageModule),
    canActivate: [VerifiedGuard],
  },
  {
    path: 'chats',
    loadChildren: () =>
      import('./chats/chats.module').then((m) => m.ChatsPageModule),
    canActivate: [VerifiedGuard],
  },
  {
    path: 'contacts',
    loadChildren: () =>
      import('./contacts/contacts.module').then((m) => m.ContactsPageModule),
    canActivate: [VerifiedGuard],
  },

  {
    path: '**',
    loadChildren: () =>
      import('./not-found/not-found.module').then((m) => m.NotFoundPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
