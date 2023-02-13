import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { AccountService } from '../service/account.service';
import { Observable, BehaviorSubject, throwError ,pipe} from 'rxjs';
import { switchMap,catchError, filter, take, finalize, tap } from 'rxjs/operators';

@Injectable({
    providedIn:'root' 
})

export class JwtInterceptor implements HttpInterceptor{
    
    constructor(private acct:AccountService){}
    private isTokenRefreshing:boolean=false;
    tokenSubject:BehaviorSubject<string>=new BehaviorSubject<string>(null);
    
    intercept(request:HttpRequest<any>,next:HttpHandler):Observable<HttpEvent<any>>
    {
        //Check if the user is logging in for the first time
    
        return next.handle(this.attachTokenToRequest(request)).pipe(
            tap((event : HttpEvent<any>) => {
                if(event instanceof HttpResponse) 
                {
                    console.log("Success");
                }
            }),
            catchError((err) : Observable<any> => {
                if(err instanceof HttpErrorResponse) {
                    switch((<HttpErrorResponse>err).status) 
                    {
                        case 401:   //unauthorized
                            console.log("Token expired. Attempting refresh ...");
                            return this.handleHttpResponseError(request, next);
                        case 403:   //bad request
                            return <any>this.acct.logout();
                        default:
                            return throwError(this.handleError);
                    }
                } else 
                {
                    
                    return throwError(this.handleError);
                }
            })
        )
    }

      // Global error handler method
      private handleError(errorResponse:HttpErrorResponse)
      {
          
          let errorString:string;
          if(errorResponse.error instanceof Error)    //network related error.Not server side
          {
              errorString="An error occured :"+errorResponse.error.message;
          }
          else
          {
              // The backend returned an unsuccessful response code.
              // The response body may contain clues, as to what went wrong
              errorString=`Backend returned code ${errorResponse.status}, body was ${errorResponse.error}`;
          }
          return throwError(errorString);
      }

     // Method to handle http error response
     private handleHttpResponseError(request:HttpRequest<any>,next:HttpHandler){
        // First thing to check if the token is in the process of refreshing
        if(!this.isTokenRefreshing) // If the token refresh is not true
        {
            this.isTokenRefreshing=true;
             // Any existing value is set to null
             // Reset here so that the following request will wait until the token comes back from the refresh token api call
            this.tokenSubject.next(null);

            console.log('ready to refresh token');

            // call the api to refresh the token
            this.acct.getNewRefreshToken().pipe(
                switchMap((tokenResponse:any)=>{

                    if(tokenResponse)
                    {
                        console.log('refresh token received');
                        this.tokenSubject.next(tokenResponse.authToken.result.token);
                       
                        localStorage.setItem('jwt',tokenResponse.authToken.token);
                        localStorage.setItem('username',tokenResponse.authToken.username);
                        localStorage.setItem('expiration',tokenResponse.authToken.expiration);
                        localStorage.setItem('userRole',tokenResponse.authToken.roles);
                        localStorage.setItem('displayname',tokenResponse.authToken.displayName);
                        localStorage.setItem('refreshToken',tokenResponse.authToken.refresh_token);
                       
                       
                        // localStorage.setItem('jwt',tokenResponse.authToken.result.token); //result.authToken.result.token
                        // localStorage.setItem('username',tokenResponse.authToken.result.username); //result.authToken.result.username
                        // localStorage.setItem('expiration',tokenResponse.authToken.result.expiration); //result.authToken.result.expiration
                        // localStorage.setItem('userRole',tokenResponse.authToken.result.roles); //result.authToken.result.roles
                        // localStorage.setItem('refreshToken',tokenResponse.authToken.result.refresh_token); //result.authToken.result.refresh_token

                        console.log('Token Refreshed ...');
                        
                        return next.handle(this.attachTokenToRequest(request));
                    }
                    return <any>this.acct.logout();
                }),
                catchError((err) =>{
                    console.log('refresh token not refreshed');
                    this.acct.logout();
                    return this.handleError(err);
                }),
                finalize( ()=>{
                    this.isTokenRefreshing=false;

                })
            );
        }
        else
        {
            this.isTokenRefreshing=false;
            return this.tokenSubject.pipe(filter(token => token!=null),
            take(1),
            switchMap(token =>{
                return next.handle(this.attachTokenToRequest(request));
            }))   
        }
    }

    private attachTokenToRequest(request:HttpRequest<any>)
    {
        let token=localStorage.getItem('jwt');
        // console.log(token);
       
        return request.clone({
                setHeaders:{
                    Authorization:`Bearer ${token}`
                }
            });
        // return request.clone({setHeaders: {Authorization: `Bearer ${token}`}});
      
    }
}