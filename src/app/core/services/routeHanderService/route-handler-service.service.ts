import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthAction } from '@models/auth-action.type';

@Injectable({
  providedIn: 'root',
})
export class RouteHandlerServiceService {
  constructor(private router: Router) {}

  handleAuthAction(action: AuthAction) {
    switch (action) {
      case 'unauthorized':
        return this.router.navigateByUrl('/sign-in');
      case 'verify-email':
        return this.router.navigateByUrl('/verify-email');
      case 'set-up-profile':
        return this.router.navigateByUrl('/settings/profile');
      case 'go': {
        const url = this.router.url;
        if (url.includes('returnUrl=')) {
          return this.router.navigateByUrl(
            new URLSearchParams(url.split('?')[1]).get('returnUrl')
          );
        }
        return this.router.navigateByUrl('/chats');
      }
    }
  }
}
