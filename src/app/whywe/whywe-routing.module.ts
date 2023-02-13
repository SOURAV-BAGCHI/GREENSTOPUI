import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhyweComponent } from './whywe.component';

const routes: Routes = [{ path: '', component: WhyweComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WhyweRoutingModule { }
