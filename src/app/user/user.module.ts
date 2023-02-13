import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MaterialModule } from '../module/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService } from '../guards/auth-guard.service';
import { JwtInterceptor } from '../_helpers/jwt.interceptor';


@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    FormsModule,ReactiveFormsModule,
    HttpClientModule
  ],
  providers:[    
    AuthGuardService,
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true}]
})
export class UserModule { }
