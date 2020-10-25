import { Injectable, OnInit } from '@angular/core';
import { Storage } from '@ionic/Storage';

@Injectable({
  providedIn: 'root'
})
export class ServiceService implements OnInit {

  alarms = [];

  constructor(private storage: Storage) {  }

  async ngOnInit() { // Checks theme on startup
    if (await this.storage.get('themeToggle') === true) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  async changeTheme(themeToggle: boolean) { // Changes theme in storage
    await this.storage.set('themeToggle', themeToggle);
    if (themeToggle === true) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }

  async snoozeToggle(snoozeToggleDefault: boolean) { // Changes snooze default in storage
    await this.storage.set('snoozeToggle', snoozeToggleDefault);
  }

  async getSnoozeToggle() {  // Gets snooze in storage
    return await this.storage.get('snoozeToggle');
  }

  async changeRingtone(ringtoneDefault: string) { // Changes ringtone default in storage
    await this.storage.set('ringtone', ringtoneDefault);
  }

  async getRingtone() { // Gets ringtone in storage
    return await this.storage.get('ringtone');
  }

  async storeAlarm(alarm = []) { // Stores new alarm in storage
    await this.storage.set('alarm', alarm);
  }

  async getAlarms() { // Gets all the alarms in storage
    return await this.storage.get('alarm');
  }

  async deleteAlarm(index: number) { // Deletes an alarm from storage
    await this.storage.get('alarm').then((data) => {
      this.alarms = data;
    });

    this.alarms.splice(index, 1);
    await this.storage.set('alarm', this.alarms);
  }

  async updateAlarms(alarm: any) { // Updates an in storage on edit
    this.storage.remove('alarm');
    this.storage.set('alarm', alarm);
  }

  async setLocation(long: number, lat: number) { // Changes location in storage
    await this.storage.set('long', long);
    await this.storage.set('lat', lat);
  }

  async getLong() { // Gets longitude in storage
    return await this.storage.get('long');
  }

  async getLat() { // Gets latitude in storage
    return await this.storage.get('lat');
  }

}
