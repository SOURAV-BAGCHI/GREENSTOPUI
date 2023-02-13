import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { MaterialModule } from './module/material/material.module';
import { TestComponent } from './test/test.component';
import { AdditionalInfoDialogComponent } from './dialog/additional-info-dialog/additional-info-dialog.component';
import { TestDialogComponent } from './dialog/test-dialog/test-dialog.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { SidenavDialogComponent } from './dialog/sidenav-dialog/sidenav-dialog.component';
import { CartDialogComponent } from './dialog/cart-dialog/cart-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { InitialsPipe } from './pipe/initials.pipe';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import { AuthGuardService } from './guards/auth-guard.service';
import { AdminGuardGuard } from './guards/admin-guard.guard';
import { RoleEmployeeDialogComponent } from './dialog/role-employee-dialog/role-employee-dialog.component';
import { VOtpAndCompleteOComponent } from './dialog/v-otp-and-complete-o/v-otp-and-complete-o.component';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { AdminSidenavDialogComponent } from './dialog/admin-sidenav-dialog/admin-sidenav-dialog.component';
import { OrderDetailsDialogComponent } from './dialog/order-details-dialog/order-details-dialog.component';
import { OrderStatusLogComponent } from './dialog/order-status-log/order-status-log.component';
import { SubscribeTestComponent } from './subscribe-test/subscribe-test.component';
import { StartupDialogComponent } from './dialog/startup-dialog/startup-dialog.component';
import { CatagoryItemInsertUpdateDialogComponent } from './dialog/catagory-item-insert-update-dialog/catagory-item-insert-update-dialog.component';
import { ItemListDialogComponent } from './dialog/item-list-dialog/item-list-dialog.component';
// import { StartupDialogComponent } from './startup-dialog/startup-dialog.component';

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
  declarations: [
    AppComponent,
    NavMenuComponent,
    FooterComponent,
    HomeComponent,
    TestComponent,
    AdditionalInfoDialogComponent,
    TestDialogComponent,
    SidenavDialogComponent,
    CartDialogComponent,
    InitialsPipe,
    RoleEmployeeDialogComponent,
    VOtpAndCompleteOComponent,
    AdminSidenavDialogComponent,
    OrderDetailsDialogComponent,
    OrderStatusLogComponent,
    SubscribeTestComponent,
    StartupDialogComponent,
    CatagoryItemInsertUpdateDialogComponent,
    ItemListDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,ReactiveFormsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    NgDialogAnimationService,
    AuthGuardService,
    AdminGuardGuard,
    {provide:HTTP_INTERCEPTORS,useClass:JwtInterceptor,multi:true},
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: DateFormats }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
