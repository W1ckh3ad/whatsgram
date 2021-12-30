import { Component, OnInit } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import {
  Router,
  NavigationStart,
  Event,
  ActivatedRoute,
} from '@angular/router';
import { Storage } from '@capacitor/storage';
import { BehaviorSubject } from 'rxjs';
import { CryptoService } from './services/crypto/crypto.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  private authStatusSub = new BehaviorSubject<User>(null);
  showNav = true;
  constructor(
    private auth: Auth,
    private router: Router,
    private route: ActivatedRoute,
    private crypto: CryptoService
  ) {
    this.authStatusListener();
  }

  async ngOnInit() {
    let { value: theme } = await Storage.get({ key: 'theme' });
    if (theme == null) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    document.body.classList.add(theme);

    const message = 'Test 123';
    const keys = await this.crypto.exportKeys(await this.crypto.generateKeys());
    console.log(keys, message);
    // const keyObj = await this.crypto.importKeys(
    //   keys.privateKey,
    //   keys.publicKey
    // );

    const publicKeyObj = await this.crypto.importPublicKey(keys.publicKey);
    console.log(publicKeyObj);
    const privateKeyObj = await this.crypto.importPrivateKey(keys.privateKey);
    console.log(privateKeyObj);
    const encrypted = await this.crypto.encryptMessage(message, publicKeyObj);
    console.log(encrypted);
    const decrypted = await this.crypto.decryptMessage(
      encrypted,
      privateKeyObj
    );
    console.log(decrypted);
  }

  private authStatusListener() {
    this.auth.onAuthStateChanged((credential) => {
      if (credential) {
        if (credential.emailVerified) {
          this.authStatusSub.next(credential);
          if (window.location.pathname === '/sign-in') {
            this.router.navigateByUrl('/chats');
          }
        } else {
          this.router.navigateByUrl('/verify-email');
        }
      } else {
        this.authStatusSub.next(null);
        if (window.location.href !== '/sign-in') {
          this.router.navigateByUrl('/sign-in');
        }
      }
    });
  }
}
