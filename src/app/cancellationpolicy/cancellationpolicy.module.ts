import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CancellationpolicyRoutingModule } from './cancellationpolicy-routing.module';
import { CancellationpolicyComponent } from './cancellationpolicy.component';


@NgModule({
  declarations: [CancellationpolicyComponent],
  imports: [
    CommonModule,
    CancellationpolicyRoutingModule
  ]
})
export class CancellationpolicyModule { }
