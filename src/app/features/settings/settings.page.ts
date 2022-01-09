import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
import { WhatsgramUser } from '@models/whatsgram.user.model';
import { AccountService } from '@services/account/account.service';
import { AuthService } from '@services/auth/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user$: Observable<WhatsgramUser>;
  isDarkMode: boolean;
  constructor(
    private auth: AuthService,
    private account: AccountService,
    private router: Router
  ) {}

  async ngOnInit() {
    const themeStorage = await Storage.get({ key: 'theme' });
    this.user$ = this.account.user;
    this.isDarkMode = themeStorage.value === 'dark';
  }

  async logout() {
    await this.auth.signOut();
    this.router.navigateByUrl('/login');
  }

  async toggleTheme(ev) {
    this.isDarkMode = ev.detail.checked;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    document.body.className = newTheme;
    await Storage.set({ key: 'theme', value: newTheme });
  }
}
