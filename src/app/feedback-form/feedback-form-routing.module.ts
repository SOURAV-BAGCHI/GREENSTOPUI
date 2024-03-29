import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedbackFormComponent } from './feedback-form.component';

const routes: Routes = [{ path: ':orderid', component: FeedbackFormComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedbackFormRoutingModule { }
