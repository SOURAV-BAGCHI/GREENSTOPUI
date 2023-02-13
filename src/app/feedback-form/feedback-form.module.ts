import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeedbackFormRoutingModule } from './feedback-form-routing.module';
import { FeedbackFormComponent } from './feedback-form.component';
import { MaterialModule } from '../module/material/material.module';
import { StarRatingComponent } from '../subComponent/star-rating/star-rating.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [FeedbackFormComponent,
    StarRatingComponent],
  imports: [
    CommonModule,
    MaterialModule,
    FeedbackFormRoutingModule,
    FormsModule,ReactiveFormsModule
    
    
  ]
})
export class FeedbackFormModule { }
