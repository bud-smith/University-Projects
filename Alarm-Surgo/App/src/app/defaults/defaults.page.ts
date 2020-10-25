import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/Storage';
import { ServiceService } from '../service.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-defaults',
  templateUrl: './defaults.page.html',
  styleUrls: ['./defaults.page.scss'],
})
export class DefaultsPage implements OnInit {

  snoozeToggleDefault: boolean;
  ringtoneDefault: string;
  audio: string;

  constructor(private storage: Storage,
              private serviceService: ServiceService,
              private nativeAudio: NativeAudio,
              private platform: Platform) {  }

  async ngOnInit() { // Retrieves data of snooze and ringtone default from storage
    this.snoozeToggleDefault = await this.storage.get('snoozeToggle');
    this.ringtoneDefault = await this.storage.get('ringtone');
  }

  async snoozeToggle() { // Changes snooze value in storage
    this.serviceService.snoozeToggle(this.snoozeToggleDefault);
  }

  async changeRingtone() { // Changes ringtone value in storage
    this.serviceService.changeRingtone(this.ringtoneDefault);
  }

  async playAudio() { // Plays default selected ringtone
    await this.serviceService.getRingtone().then((data) => {
      this.audio = data;
      if (this.platform.is('cordova')) {
        if (this.audio !== null && this.audio !== 'None') {
          this.nativeAudio.preloadSimple(this.audio, 'assets/audio/' + this.audio + '.mp3').then(() => {
            this.nativeAudio.play(this.audio, () => this.nativeAudio.unload(this.audio));
          });
        }
      }
    });
  }

}
