import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CurrentOrderComponent } from './current-order/current-order.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { DeliveryInfoComponent } from './delivery-info/delivery-info.component';
import { RegisterEmployeeComponent } from './register-employee/register-employee.component';
import { ViewEmployeeComponent } from './view-employee/view-employee.component';
import { AdminGuardGuard } from '../guards/admin-guard.guard';
import { JwtInterceptor } from '../_helpers/jwt.interceptor';
import { AuthGuardService } from '../guards/auth-guard.service';
import { AdminComponent } from './admin/admin.component';
import { MaterialModule } from '../module/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { ReportComponent } from './report/report.component';
import { ModifyCatagoryItemListComponent } from './modify-catagory-item-list/modify-catagory-item-list.component';

export const DateFormats = {
  parse: {
      dateInput: ['DD-MM-YYYY']
  },
  display: {
      dateInput: 'DD-MM-YYYY',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
  },
};
@NgModule({
  declarations: [CurrentOrderComponent, OrderHistoryComponent, DeliveryInfoComponent, RegisterEmployeeComponent, ViewEmployeeComponent, AdminComponent, ReportComponent, ModifyCatagoryItemListComponent],
  imports: [
    CommonModule,
    MaterialModule,
    AdminRoutingModule,
    FormsModule,ReactiveFormsModule,
    HttpClientModule
  ],
  providers:[
    AuthGuardService,
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }
  ]
})
export class AdminModule { }
