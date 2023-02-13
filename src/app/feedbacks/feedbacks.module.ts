import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbacksRoutingModule } from './feedbacks-routing.module';
import { FeedbacksComponent } from './feedbacks.component';
import { MaterialModule } from '../module/material/material.module';


@NgModule({
  declarations: [FeedbacksComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FeedbacksRoutingModule
  ]
})
export class FeedbacksModule { }
