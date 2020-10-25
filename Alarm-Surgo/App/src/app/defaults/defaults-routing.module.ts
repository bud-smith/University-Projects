import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultsPage } from './defaults.page';

const routes: Routes = [
  {
    path: '',
    component: DefaultsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DefaultsPageRoutingModule {}
