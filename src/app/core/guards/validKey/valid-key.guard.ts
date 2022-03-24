import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ValidKeyGuard implements CanActivate {
  constructor(
    private cryptoKeyStorage: CryptoKeysService,
    private router: Router
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.cryptoKeyStorage
      .getPrivateKey()
      .then((x) => {
        if (!x) this.router.navigateByUrl('register-device');
        return true;
      })
      .catch((x) => true);
  }
}
