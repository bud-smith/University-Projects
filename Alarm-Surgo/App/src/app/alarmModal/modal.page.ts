import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { Storage } from '@ionic/Storage';
import { ServiceService } from '../service.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {

  label: string;
  time: Date;
  repeat: [string];
  ringtone: string;
  snooze: boolean;
  picture: any;
  audio: string;

  schedule = [];

  constructor(
    private navParams: NavParams,
    private modalController: ModalController,
    private imagePicker: ImagePicker,
    private localNotifications: LocalNotifications,
    private serviceService: ServiceService,
    private keyboard: Keyboard,
    private nativeAudio: NativeAudio,
    private platform: Platform) {  }

  ngOnInit() { // Retreives data from alarm page to be displayed.
    this.label = this.navParams.get('label');
    this.time = this.navParams.get('time');
    this.repeat = this.navParams.get('repeat');

    if (this.navParams.get('ringtone') === undefined) {
      this.serviceService.getRingtone().then(data => {
        this.ringtone = data;
      });
    } else {
      this.ringtone = this.navParams.get('ringtone');
    }

    if (this.navParams.get('snooze') === undefined) {
      this.serviceService.getSnoozeToggle().then(data => {
        this.snooze = data;
      });
    } else {
      this.snooze = this.navParams.get('snooze');
    }
  }

  viewPictures() { // Views pictures stored on device.
    if (this.platform.is('cordova')) {
      const options = {
        maximumImagesCount: 1,
        outputType: 1
      };

      this.imagePicker.getPictures(options).then((results) => { // returns image chosen by user.
        if (results.length !== 0) {
          this.picture = 'data:image/jpeg;base64,' + results;
        }
      });
    }
  }

  removePictures() { // Removes image if has been selected.
    this.picture = undefined;
  }
  doneModal() {
    if (this.time !== undefined && this.ringtone !== undefined) { // Continue, if user selected time and ringtone
      this.modalController.dismiss({label: this.label, time: this.time, repeat: this.repeat,
        ringtone: this.ringtone, snooze: this.snooze, picture: this.picture}); // On modal dismiss returns an alarm data structure.
    }
  }

  cancelModal() { // Cancels modal.
    this.modalController.dismiss();
  }

  closeKeyboard() { // Closes keyboard on press enter.
    this.keyboard.hide();
  }

  playAudio() { // Plays selected audio to device.
    if (this.platform.is('cordova')) {
      if (this.ringtone !== null && this.ringtone !== 'None') {
        this.nativeAudio.preloadSimple(this.ringtone, 'assets/audio/' + this.ringtone + '.mp3').then(() => {
          this.nativeAudio.play(this.ringtone, () => this.nativeAudio.unload(this.ringtone));
        });
      }
    }
  }

}
