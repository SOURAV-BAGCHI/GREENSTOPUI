import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrentOrderComponent } from './current-order/current-order.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { AuthGuardService } from '../guards/auth-guard.service';
import { ReportComponent } from './report/report.component';
import { ModifyCatagoryItemListComponent } from './modify-catagory-item-list/modify-catagory-item-list.component';

const routes: Routes = [
  {path:'current-order',component:CurrentOrderComponent,canActivate:[AuthGuardService]},
  {path:'order-history',component:OrderHistoryComponent,canActivate:[AuthGuardService]},
  {path:'delivery-info',component:DeliveryInfoComponent,canActivate:[AuthGuardService]},
  {path:'register-employee',component:RegisterEmployeeComponent,canActivate:[AuthGuardService]},
  {path:'view-employee',component:ViewEmployeeComponent,canActivate:[AuthGuardService]},
  {path:'reports',component:ReportComponent,canActivate:[AuthGuardService]},
  {path:'modify-catagoryitem',component:ModifyCatagoryItemListComponent,canActivate:[AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
