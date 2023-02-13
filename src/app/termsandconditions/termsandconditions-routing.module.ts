import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TermsandconditionsComponent } from './termsandconditions.component';

const routes: Routes = [{ path: '', component: TermsandconditionsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsandconditionsRoutingModule { }
