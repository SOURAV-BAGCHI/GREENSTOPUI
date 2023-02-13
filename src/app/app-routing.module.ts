import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TestComponent } from './test/test.component';
import { AdminComponent } from './admin/admin/admin.component';
import { CustomPreloadingService } from './appServices/custom-preloading.service';
import { SubscribeTestComponent } from './subscribe-test/subscribe-test.component';

const routes: Routes = [
  {path:'home',data:{preload:true},component:HomeComponent},
  {path:'test',component:TestComponent},
  {path:'',component:HomeComponent,pathMatch:'full'},
  {path:'order',data:{preload:true},loadChildren:()=>import('./order/order.module').then(m=>m.OrderModule)},
  {path:'user',data:{preload:true},loadChildren:()=>import('./user/user.module').then(m=>m.UserModule)},
  {path:'admin',component:AdminComponent,loadChildren:()=>import('./admin/admin.module').then(m=>m.AdminModule)},
  {path: 'whywe', loadChildren: () => import('./whywe/whywe.module').then(m => m.WhyweModule) },
  {path: 'termsandconditions', loadChildren: () => import('./termsandconditions/termsandconditions.module').then(m => m.TermsandconditionsModule) },
  {path: 'cancellationpolicy', loadChildren: () => import('./cancellationpolicy/cancellationpolicy.module').then(m => m.CancellationpolicyModule) },
  {path: 'feedback-form', loadChildren: () => import('./feedback-form/feedback-form.module').then(m => m.FeedbackFormModule) },
  {path: 'feedbacks', loadChildren: () => import('./feedbacks/feedbacks.module').then(m => m.FeedbacksModule) },
  // {path: 'reports', loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule) },
  {path:'subscribeTest',component:SubscribeTestComponent},
  { path: 'help', loadChildren: () => import('./help/help.module').then(m => m.HelpModule) },
  {path:'**',redirectTo:'/home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes ,{
    scrollPositionRestoration: 'enabled',
    preloadingStrategy:CustomPreloadingService  
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
