import { Component, OnInit } from '@angular/core';
import { Auth, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  user: User;
  isDarkMode: boolean;
  constructor(private auth: Auth, private router: Router) {
    this.user = auth.currentUser;
  }

  async ngOnInit() {
    if (!this.user) {
      this.router.navigateByUrl('/login');
    }
    const r = (await Storage.get({ key: 'theme' }));
    console.log(r);
    this.isDarkMode = r.value === 'dark';
  }

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }

  async toggleTheme(ev) {
    console.log(ev);
    this.isDarkMode = ev.detail.checked;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    document.body.className = newTheme;
    await Storage.set({ key: 'theme', value: newTheme });
  }
}
