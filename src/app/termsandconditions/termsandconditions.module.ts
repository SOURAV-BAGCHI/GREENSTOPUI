import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TermsandconditionsRoutingModule } from './termsandconditions-routing.module';
import { TermsandconditionsComponent } from './termsandconditions.component';


@NgModule({
  declarations: [TermsandconditionsComponent],
  imports: [
    CommonModule,
    TermsandconditionsRoutingModule
  ]
})
export class TermsandconditionsModule { }
