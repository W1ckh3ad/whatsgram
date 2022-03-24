import { Component, OnDestroy, OnInit } from '@angular/core';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { ActivatedRoute } from '@angular/router';
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';
import { FirebaseCloudMessagingService } from '@services/firebaseCloudMessaging/firebase-cloud-messaging.service';
import {
  encryptMessage,
  exportPrivateKey,
  importPublicKey,
} from '@utils/crypto.utils';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-new-device',
  templateUrl: './register-new-device.page.html',
  styleUrls: ['./register-new-device.page.scss'],
})
export class RegisterNewDevicePage implements OnInit, OnDestroy {
  sub: Subscription = null;
  constructor(
    private route: ActivatedRoute,
    private fcmService: FirebaseCloudMessagingService,
    private functions: Functions,
    private cryptoKeysService: CryptoKeysService
  ) {}
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  async ngOnInit() {
    this.sub = this.cryptoKeysService.privateKey$.subscribe(async (x) => {
      if (!x) return;
      await this.fcmService.getToken();
      const privateKeyObj = x;
      if (!privateKeyObj) throw new Error('No Key to send');
      const senderDeviceId = this.fcmService.token;
      const { key, device } = this.route.snapshot.queryParams;
      const [publicKey, privateKey] = await Promise.all([
        importPublicKey(key),
        exportPrivateKey(privateKeyObj),
      ]);
      console.log(
        btoa(privateKey).length,
        btoa(privateKey).match(/.{107}/g),
        privateKey
      );
      const groups = btoa(privateKey).match(/.{50}/g);
      const promises = [];
      groups.forEach((x) => promises.push(encryptMessage(x, publicKey)));
      const keys = await Promise.all(promises);
      try {
        const callable = httpsCallable<
          { keys: string[]; senderDeviceId: string; receiverDeviceId: string },
          string
        >(this.functions, 'sendPrivateKey');
        console.log('call send private key', {
          keys: keys,
          senderDeviceId,
          receiverDeviceId: device,
        });
        return await callable({
          keys: keys,
          senderDeviceId,
          receiverDeviceId: device,
        });
      } catch (error) {
        console.error('create group error', error);
        throw error;
      }
    });
  }
}
