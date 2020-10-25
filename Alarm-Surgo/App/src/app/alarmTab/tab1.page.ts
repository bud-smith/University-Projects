import { Component, OnInit } from '@angular/core';
import { ModalPage } from '../alarmModal/modal.page';
import { ModalController, Platform } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ServiceService } from '../service.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  alarm = [];
  alert: Date;
  notifications: any[] = [];

  constructor(private modalController: ModalController,
              private alertController: AlertController,
              private serviceService: ServiceService,
              private localNotifications: LocalNotifications,
              private platform: Platform) {  }

  async ngOnInit() { // On load assigns stored data to alarms array
    this.serviceService.getAlarms().then((data) => {
      if (data !== null) {
        this.alarm = data;
      }
    });
  }

  async addAlarm() { // Displays modal to add alarm.
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {}
    });
    modal.onDidDismiss().then((retval) => {
      if (retval.data !== undefined && retval.data.time !== undefined && retval.data.ringtone !== undefined) {
        this.alarm.push(retval.data);
        this.serviceService.storeAlarm(this.alarm);

        this.createNotification(retval.data);
      }
    });
    return modal.present();
  }

  async deleteAlarm(index: number) { // Deletes alarm from alarms list.
    const alert = await this.alertController.create({
      header: 'Delete Alarm',
      message: 'Are you sure?',
      buttons: [{ text: 'Cancel' },
                { text: 'Delete', handler: () => { this.alarm.splice(index, 1);
                                                   this.serviceService.deleteAlarm(index); }}]});
    return alert.present();
  }

  async editAlarm(index: number) { // Displays modal of alarm to be edited.
    const modal = await this.modalController.create({
      component: ModalPage,
      componentProps: {label: this.alarm[index].label, time: this.alarm[index].time, repeat: this.alarm[index].repeat,
        ringtone: this.alarm[index].ringtone, snooze: this.alarm[index].snooze, picture: this.alarm[index].picture}
    });
    modal.onDidDismiss().then((retval) => {
      if (retval.data !== undefined) {
        this.alarm[index].label = retval.data.label;
        this.alarm[index].time = retval.data.time;
        this.alarm[index].repeat = retval.data.repeat;
        this.alarm[index].ringtone = retval.data.ringtone;
        this.alarm[index].snooze = retval.data.snooze;
        this.alarm[index].picture = retval.data.picture;
        this.serviceService.updateAlarms(this.alarm);
      }
    });

    return modal.present();
  }

  noAlarmsCheck() { // Boolean return if any alarms exist.
    if (this.alarm.length === 0) {
      return true;
    } else {
      return false;
    }
  }

  createNotification(alarm: any) { // Schedules a notification to be displayed at a specified time.
    if (this.platform.is('cordova')) {
      this.localNotifications.schedule({
        title: alarm.label,
        attachments: [alarm.picture],
        sound: 'assets/audio/' + alarm.ringtone + '.mp3',
        actions: [
          { id: 'disable', title: 'Disable'},
          { id: 'snooze', title: 'Snooze' }
        ],
        trigger: { at: new Date(alarm.time) },
      });
    }
  }
}
