import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './order-list/order-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { AuthGuardService } from '../guards/auth-guard.service';
import { JwtInterceptor } from '../_helpers/jwt.interceptor';
import { MaterialModule } from '../module/material/material.module';


@NgModule({
  declarations: [OrderListComponent, OrderDetailsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    OrderRoutingModule,
    HttpClientModule
  ],
  providers:[
    AuthGuardService,
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true}
  ]
})
export class OrderModule { }
