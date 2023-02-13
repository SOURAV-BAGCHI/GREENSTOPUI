import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { config } from '../config';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { Register } from '../models/register';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private http:HttpClient,private router:Router,private storage :StorageService) { }

  // url's to access our web api's
  private hostAddress=config.hostname;
  private baseUrlRegister:string=this.hostAddress+'api/account/register';
  //  private baseUrlLogin:string=this.hostAddress+'api/account/login';
  private baseUrlAuth:string=this.hostAddress+'api/Token/Auth';
  private baseUrlCheckNumberAvailability:string=this.hostAddress+'api/message/checknumberavailability'

  // user related properties
  private loginStatus=new BehaviorSubject<boolean>(this.checkLoginStatus());
  private username=new BehaviorSubject<string>(localStorage.getItem('username'));
  private userrole=new BehaviorSubject<string>(localStorage.getItem('userRole'));
  private displayname=new BehaviorSubject<string>(localStorage.getItem('displayname'));
  private isrolecustomer$=new BehaviorSubject<boolean>(this.isrolecustomer());
  private checknumberavailability$:Observable<number>;
  

  //Register Method
  register(registrationData:Register){
    console.log('registration request');
    return this.http.post<any>(this.baseUrlRegister,registrationData).pipe(
      map(result=>{
        // registration was successful
        return result;
      },(error: any)=>{
        console.log('Error occured');
        return error;
      }
      )
    )
  }

  // Method to get new refresh token
  getNewRefreshToken():Observable<any>
  {
    let username=localStorage.getItem('username');
    let refreshToken=localStorage.getItem('refreshToken');
    const grantType="refresh_token";

    console.log('Requesting for refresh token');

    return this.http.post<any>(this.baseUrlAuth,{Username:username,RefreshToken:refreshToken,GrantType:grantType}).pipe(
      map(result=>{
        if(result && result.authToken.token)  //result.authToken.token
        {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          this.loginStatus.next(true);
          // localStorage.setItem('loginStatus','1');
          // localStorage.setItem('jwt',result.authToken.token); //result.authToken.result.token
          // localStorage.setItem('username',result.authToken.username); //result.authToken.result.username
          // localStorage.setItem('expiration',result.authToken.expiration); //result.authToken.result.expiration
          // localStorage.setItem('userRole',result.authToken.roles); //result.authToken.result.roles
          // localStorage.setItem('refreshToken',result.authToken.refresh_token); //result.authToken.result.refresh_token
          this.setDataInLocalStorage(result);
          
          // this.username.next(localStorage.getItem('username'));
          // this.roles.next(localStorage.getItem('userRole'));

          console.log('token refreshed');
        
        }
        return <any>result;
      },
      // (error=>{
      //   console.log("Error");
      // })
      ),
      catchError((err) : Observable<any> =>{
        console.log('refresh token not refreshed');
        return err;
    })     
    );
  }

  //Login Method
  login(username:string,password:string)
  {
    const grantType="password";
    return this.http.post<any>(this.baseUrlAuth,{username,password,grantType}).pipe(
      map(result=>{
        //console.log(result);
        // Login successful if there's a jwt token in the response
        if(result && result.authToken.token)
        {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.loginStatus.next(true);
            // localStorage.setItem('loginStatus','1');
            // localStorage.setItem('jwt',result.authToken.token);
            // localStorage.setItem('username',result.authToken.username);
            // localStorage.setItem('expiration',result.authToken.expiration);
            // localStorage.setItem('userRole',result.authToken.roles);
            // localStorage.setItem('refreshToken',result.authToken.refresh_token);
            this.setDataInLocalStorage(result);
            this.username.next(localStorage.getItem('username'));
            this.userrole.next(localStorage.getItem('userRole'));
            this.displayname.next(localStorage.getItem('displayname'));
        }
        return result;
      },(error: any)=>{
        return error;
      })
    );
  }

  //Login using OTP
  otpLogin(username:string)
  {
    const grantType="otplogin";
    return this.http.post<any>(this.baseUrlAuth,{username,grantType}).pipe(
      map(result=>{
        //console.log(result);
        // Login successful if there's a jwt token in the response
        if(result && result.authToken.token)
        {
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            this.loginStatus.next(true);
            // localStorage.setItem('loginStatus','1');
            // localStorage.setItem('jwt',result.authToken.token);
            // localStorage.setItem('username',result.authToken.username);
            // localStorage.setItem('expiration',result.authToken.expiration);
            // localStorage.setItem('userRole',result.authToken.roles);
            // localStorage.setItem('refreshToken',result.authToken.refresh_token);
            this.setDataInLocalStorage(result);
            this.username.next(localStorage.getItem('username'));
            this.userrole.next(localStorage.getItem('userRole'));
            this.displayname.next(localStorage.getItem('displayname'));
        }
        return result;
      },(error: any)=>{
        return error;
      })
    );
  }

  checknumberavailability(number:string):Observable<number>{
    this.checknumberavailability$=this.http.get<number>(this.baseUrlCheckNumberAvailability+'/'+number);
    
    return this.checknumberavailability$;
 
  }

  logout(){
    this.loginStatus.next(false);
    localStorage.setItem('loginStatus','0');
    localStorage.removeItem('jwt');
    localStorage.removeItem('username');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userRole');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem("displayname");
    // sessionStorage.removeItem("iscustomerInfoAvailable");

    this.storage.removeCustomerInfo();

    this.isrolecustomer$.next(this.isrolecustomer());

    this.router.navigate(['/']);
  }

  checkLoginStatus():boolean{
   
    let loginCookie= localStorage.getItem('loginStatus');
   
    if(loginCookie==='1')
    {
      // Get token from local storage
      if(localStorage.getItem('jwt')!==null || localStorage.getItem('jwt')!==undefined)
      {
        return true;
      }
      /*
      const token=localStorage.getItem('jwt');
      const decode=jwt_decode(token);

      // Check if the cookie is valid
      if(decode.exp === undefined)
      {
        return false;
      }

      // Get current date time
      let date=new Date(0);

      // Convert exp time to utc
      let tokenExpDate=date.setUTCSeconds(decode.exp);

      // If value of token time greater than
      if(tokenExpDate.valueOf()>new Date().valueOf())
      {
        return true;
      }
      return false;*/
    }
    return false;
  }

  get isLoggedIn(){
    return this.loginStatus.asObservable();
  }

  get currentUserName(){
    return this.username.asObservable();
  }

  get displayUserName(){
    return this.displayname.asObservable();
  }

  get currentUserRole(){
    return this.userrole.asObservable();
  }

  isrolecustomer():boolean
  {
    let role=localStorage.getItem('userRole');
    if(role!=null && role=='Customer')
    {
      return true;
    }
    return false;
  }

  get isrolecustomr()
  {
    return this.isrolecustomer$.asObservable();
  }


  setDataInLocalStorage(result:any)
  {
    localStorage.setItem('loginStatus','1');
    localStorage.setItem('jwt',result.authToken.token);
    localStorage.setItem('username',result.authToken.username);
    localStorage.setItem('expiration',result.authToken.expiration);
    localStorage.setItem('userRole',result.authToken.roles);
    localStorage.setItem('displayname',result.authToken.displayName);
    localStorage.setItem('refreshToken',result.authToken.refresh_token);

    this.isrolecustomer$.next(this.isrolecustomer());
    this.storage.removeCustomerInfo();
  }

}
