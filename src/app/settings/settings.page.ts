import { Component, OnInit } from '@angular/core';
import { Auth, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {}

  logout() {
    signOut(this.auth).then(() => {
      this.router.navigate(['/login']);
    });
  }
}
