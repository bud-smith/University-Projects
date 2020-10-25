import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Storage } from '@ionic/Storage';
import { ServiceService } from './service.service';

import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  alarm: any;

  snoozeToggle: boolean;
  ringtone: string;

  themeToggle: boolean;

  long: number;
  lat: number;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private storage: Storage,
    private serviceService: ServiceService,
    private androidPermissions: AndroidPermissions
  ) {
    this.initializeApp();
  }

  async initializeApp() {

    this.serviceService.ngOnInit(); // Checks for theme of app.
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      // tslint:disable-next-line: max-line-length
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION, this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE]); // Checks for app permissions.
    });

    this.snoozeToggle = await this.storage.get('snoozeToggle');
    if (this.snoozeToggle !== null) { // Gets snooze toggle storage
      await this.storage.set('snoozeToggle', this.snoozeToggle);
    }

    this.themeToggle = await this.storage.get('themeToggleDefault');
    if (this.themeToggle !== null) { // Gets theme toggle storage
      await this.storage.set('themeToggle', this.themeToggle);
    }

    this.ringtone = await this.storage.get('ringtoneDefault');
    if (this.ringtone !== null) { // Gets ringtone storage
      await this.storage.set('ringtone', this.ringtone);
    }

    this.alarm = await this.storage.get('alarm');
    if (this.alarm !== null) { // Gets alarm storage
      await this.storage.set('alarm', this.alarm);
    }

    this.long = await this.storage.get('long');
    if (this.long !== null) { // Gets location longitude storage
      await this.storage.set('long', this.long);
    }

    this.lat = await this.storage.get('lat');
    if (this.lat !== null) { // Gets location latitutde storage
      await this.storage.set('lat', this.lat);
    }
  }
}
