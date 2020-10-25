import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DefaultsPageRoutingModule } from './defaults-routing.module';

import { DefaultsPage } from './defaults.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DefaultsPageRoutingModule
  ],
  declarations: [DefaultsPage]
})
export class DefaultsPageModule {}
