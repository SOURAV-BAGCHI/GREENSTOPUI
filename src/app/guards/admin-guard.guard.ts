import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AccountService } from '../service/account.service';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardGuard implements CanActivate {

  constructor(private acct:AccountService,private router:Router)
  {
    
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> 
    {
      
      return this.acct.isLoggedIn.pipe(
        take(1),
        map((loginStatus:boolean)=>{
                                                    // take function take the 1 st value from observable
          const destination:string=state.url;       // and send it to the map function
        //  const orderId=route.params.id;

          // To check if user is not logged in
          
          if(!loginStatus)
          {
              this.router.navigate(['/user/login'],{queryParams:{returnUrl:state.url}});
              return false;
          }

          this.acct.currentUserRole.subscribe(role=>{
            // if(role=='ITAdmin'||role=='OperationManager'||role=='Accounts'||role=='DeliveryManager'||role=='Kitchen'||role=='DeliveryAgents'||role=='CustomerService')
            if(role!='Customer')
            {
              
              switch(destination)
              {
                case '/admin/current-order':
                case '/admin/order-history':
                  if(role=='ITAdmin'||role=='OperationManager'||role=='Accounts'||role=='DeliveryManager'||role=='CustomerService')
                  {
                    console.log('adminguardguard... is on '+'role is '+role+' ,destination is '+destination);
                    return true;
                  }
                case '/admin/delivery-info':
                  if(role=='ITAdmin'||role=='OperationManager'||role=='DeliveryManager'||role=='DeliveryAgents'||role=='CustomerService')
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

                default:
                  this.router.navigate(['/']);
                  return false;
              }

            }
            this.router.navigate(['/']);
            return false;
          })

        })
        );
    
  }
  
}
