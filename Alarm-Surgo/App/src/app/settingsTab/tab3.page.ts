import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/Storage';
import { ServiceService } from '../service.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  themeToggleDefault: boolean;

  constructor(private storage: Storage,
              private serviceService: ServiceService) {  }

  async ngOnInit() {
    this.themeToggleDefault  = await this.storage.get('themeToggle');

    if (await this.storage.get('themeToggle') === true) { // Changes to dark theme.
      document.body.classList.add('dark');
    } else { // Else switch to light theme.
      document.body.classList.remove('dark');
    }
  }

  async changeData() { // Store theme on toggle change.
    this.serviceService.changeTheme(this.themeToggleDefault);
  }

}
