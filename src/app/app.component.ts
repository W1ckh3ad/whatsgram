import { Component, OnInit } from '@angular/core';
import { Storage } from '@capacitor/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  showNav = true;

  constructor() {}

  async ngOnInit() {
    try {
      let { value: theme } = await Storage.get({ key: 'theme' });
      if (theme == null) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      }
      document.body.classList.add(theme);
    } catch (error) {
      console.error('Reading Storage error', error);
      throw error;
    }
  }
}
