import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './order-list/order-list.component';
import { AuthGuardService } from '../guards/auth-guard.service';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  {path:'',component:OrderListComponent,canActivate:[AuthGuardService]},
  {path:'order-list',component:OrderListComponent,canActivate:[AuthGuardService]},
  {path:':id',component:OrderDetailsComponent,canActivate:[AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule],
  providers:[AuthGuardService]
})
export class OrderRoutingModule { }
