import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../service/account.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private acct:AccountService,private router:Router) { }

  canActivate(route:ActivatedRouteSnapshot,state:RouterStateSnapshot):Observable<boolean>
  {
      return this.acct.isLoggedIn.pipe(take(1),
      map((loginStatus:boolean)=>{
                                                  // take function take the 1 st value from observable
        const destination:string=state.url;       // and send it to the map function
        const orderId=route.params.id;

        // To check if user is not logged in
        if(!loginStatus)
        {
            this.router.navigate(['/user/login'],{queryParams:{returnUrl:state.url}});
            return false;
        }
        // If user is already logged in
        let role=localStorage.getItem('userRole');
        switch(destination)
        {
          case '/order':
          case '/order/'+orderId:
          {
            // if(localStorage.getItem('userRole')=== 'ITAdmin' ||localStorage.getItem('userRole')=== 'Customer' ||localStorage.getItem('userRole')=== 'Moderator')
            // {
            //   return true;
            // }
            return true;
          }
          case '/admin/current-order':
          case '/admin/order-history':
           // if(role=='ITAdmin'||role=='OperationManager'||role=='Accounts'||role=='DeliveryManager'||role=='CustomerService'||role=='DeliveryAgents'|| role=='Kitchen')
           if(role !=null && role !='Customer') 
           {
              // console.log('adminguardguard... is on '+'role is '+role+' ,destination is '+destination);
              return true;
            }
          case '/admin/reports':
            if(role=='ITAdmin'||role=='ChiefManager' ||role=='CustomerService')
            {
              return true;
            }
          case '/admin/register-employee':
          case '/admin/view-employee':
            if(role=='ITAdmin')
            {
              return true;
            }
          break;
          case '/admin/modify-catagoryitem':
            if(role=='ITAdmin'||role=='ChiefManager' ||role=='CustomerService')
            {  
              return true;
            }
            break;
          default:
            return false;
        }

        return false;
      }));
  }
}
