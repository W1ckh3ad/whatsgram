import { Component, OnInit } from '@angular/core';
import { Device } from '@models/device.model';
import { DocumentBase } from '@models/document-base.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AccountService } from '@services/account/account.service';
import { FirebaseCloudMessagingService } from '@services/firebaseCloudMessaging/firebase-cloud-messaging.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements OnInit {
  user$: Observable<WhatsgramUser> = null;
  devices$: Observable<(Device & DocumentBase)[]> = null;
  constructor(private account: AccountService, public fcm: FirebaseCloudMessagingService) {}

  ngOnInit() {
    this.user$ = this.account.user$;
    this.devices$ = this.account.devices$;
  }
}
