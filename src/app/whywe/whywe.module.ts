import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WhyweRoutingModule } from './whywe-routing.module';
import { WhyweComponent } from './whywe.component';


@NgModule({
  declarations: [WhyweComponent],
  imports: [
    CommonModule,
    WhyweRoutingModule
  ]
})
export class WhyweModule { }
