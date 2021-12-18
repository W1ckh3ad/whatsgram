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
  image;
  constructor(private auth: Auth, private router: Router) {
    this.user = auth.currentUser;
    this.image =
      // this.user.photoURL && this.user.photoURL !== '' && false
      //   ? this.user.photoURL
      //   :
      `https://avatars.dicebear.com/api/identicon/${this.user.email}.svg`;
    console.log(auth.currentUser);
  }

  async ngOnInit() {
    const r = await Storage.get({ key: 'theme' });
    this.isDarkMode = r.value === 'dark';
  }

  async logout() {
    await signOut(this.auth);
    this.router.navigateByUrl('/login');
  }

  async toggleTheme(ev) {
    console.log(ev);
    this.isDarkMode = ev.detail.checked;
    const newTheme = this.isDarkMode ? 'dark' : 'light';
    document.body.className = newTheme;
    await Storage.set({ key: 'theme', value: newTheme });
  }
}
