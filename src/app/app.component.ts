import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Storage } from '@capacitor/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private auth: Auth) {}

  async ngOnInit() {
    let { value: theme } = await Storage.get({ key: 'theme' });
    if (theme == null) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }
    document.body.classList.add(theme);
  }
}
