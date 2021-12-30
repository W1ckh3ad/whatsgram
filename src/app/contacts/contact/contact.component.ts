import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from 'src/app/services/account/account.model';
import { getPhotoURL } from 'src/utils';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  @Input('user') user: Account;
  getPhotoURL = getPhotoURL;
  uid: string = '';
  constructor(private router: Router) {}

  ngOnInit() {}

  goto(e) {
    e.preventDefault();
    this.router.navigateByUrl('/chats/' + this.user.uid);
  }
}
