import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { Observable } from 'rxjs';
import { AccountService } from '../services/account/account.service';
import { WhatsgramUser } from '../services/account/whatsgram.user.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user$: Observable<WhatsgramUser>;
  isDarkMode: boolean;
  constructor(
    private auth: Auth,
    private account: AccountService,
    private router: Router
  ) {}

  async ngOnInit() {
    const themeStorage = await Storage.get({ key: 'theme' });
    this.user$ = this.account.user;
    this.isDarkMode = themeStorage.value === 'dark';
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
}
