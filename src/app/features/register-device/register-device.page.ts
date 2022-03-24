import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { CryptoKeysService } from '@services/cryptoKeys/crypto-keys.service';
import { FirebaseCloudMessagingService } from '@services/firebaseCloudMessaging/firebase-cloud-messaging.service';
import { exportKeys, generateKeys } from '@utils/crypto.utils';

@Component({
  selector: 'app-register-device',
  templateUrl: './register-device.page.html',
  styleUrls: ['./register-device.page.scss'],
})
export class RegisterDevicePage implements OnInit {
  keyPair: CryptoKeyPair = null;
  keys: { publicKey: string; privateKey: string } = null;
  deviceId: string = '';
  url = location.origin + '/settings/register-new-device';
  constructor(
    cryptoKeyService: CryptoKeysService,
    private fcmService: FirebaseCloudMessagingService,
    router: Router
  ) {
    if (cryptoKeyService.privateKey) {
      router.navigateByUrl('chats');
    }
  }

  async ngOnInit() {
    this.keyPair = await generateKeys();
    this.keys = await exportKeys(this.keyPair);
    await this.fcmService.getToken();
    this.deviceId = this.fcmService.token;
    const search = new URLSearchParams();
    Storage.set({
      key: 'receiveKey',
      value: this.keys.privateKey,
    });
    search.append('key', this.keys.publicKey);
    search.append('device', this.deviceId);
    this.url =
      location.origin + '/settings/register-new-device?' + search.toString();
    console.log(this.url);
  }
}
