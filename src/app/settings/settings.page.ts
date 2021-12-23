import { Component, OnInit } from '@angular/core';
import { Auth, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { Observable } from 'rxjs';
import { getPhotoURL } from '../../utils';
import { Account } from '../services/account/account.model';
import { AccountService } from '../services/account/account.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user: Observable<Account>;
  isDarkMode: boolean;
  imageObject: { email: string; photoURL: string } = {
    photoURL: '',
    email: 'T',
  };
  getPhotoURL = getPhotoURL;
  constructor(
    private auth: Auth,
    private account: AccountService,
    private router: Router
  ) {}

  async ngOnInit() {
    const [r, user] = await Promise.all([
      Storage.get({ key: 'theme' }),
      this.account.load(),
    ]);
    this.user = user;
    this.user.subscribe(
      ({ photoURL, email }) => (this.imageObject = { photoURL, email })
    );
    this.isDarkMode = r.value === 'dark';
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigateByUrl('/login');
  }

  async toggleTheme(ev) {
    this.isDarkMode = ev.detail.checked;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    document.body.className = newTheme;
    await Storage.set({ key: 'theme', value: newTheme });
  }

  toProfile(e) {
    e.preventDefault();
    this.router.navigateByUrl('/settings/profile');
  }
}
