import { Component, Input, OnInit } from '@angular/core';
import { DocumentBase } from '@models/document-base.model';
import { WhatsgramUser } from '@models/whatsgram.user.model';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input() contact: WhatsgramUser & DocumentBase = null;
  constructor() { }

  ngOnInit() {}

}
