import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { AccountService } from 'src/app/service/account.service';
import { Router, ActivatedRoute } from '@angular/router';
import { WindowService } from 'src/app/service/window.service';
import { config } from 'src/app/config';
import firebase from "firebase/app";
import "firebase/auth";
import { Observable } from 'rxjs';
import { Register } from 'src/app/models/register';
import { ActivityService } from 'src/app/service/activity.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

export class PhoneNumberFmt{
  country:string;
  area:string;
  prefix:string;
  line:string;

  get e164()
  {
    const num=this.country+this.area+this.prefix+this.line;
    return `+${num}`;
  }

  public tempe164(phone:string)
  {
    let num='91'+phone;
    return `+${num}`;
  }
}



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit,AfterViewInit {

  constructor(private acct:AccountService,
              private router:Router,
              private route:ActivatedRoute,
              private fb:FormBuilder,
              private win:WindowService,
              private activityService:ActivityService,
              private _snackBar: MatSnackBar) { } 

  insertForm:FormGroup;
  phoneFormControl:FormControl;
  returnUrl:string;
  errorMessage:string;
  invalidLogin:boolean;

  isRequestInProcess:boolean=false;
  password:string;
  phone:string='';

  private firebaseConfig=config.firebaseConfig;
  windowRef:any;
  phoneNumber=new PhoneNumberFmt();
  verificationCode:string;

  verificationCodeSend:boolean=false;
  user:any;

  verificationForm:FormGroup;
  otpFormControl:FormControl;
  private checknumberavailability$:Observable<number>;
  numberAvailable:number=0;
  
  insertDisplaynameForm:FormGroup;
  displaynameFormControl: FormControl;
  errorList:string[];
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  ngOnInit(): void {

    this.initializeValues();

    // this.windowRef=this.win.getWindowRef();
    // if (firebase.apps.length === 0) {
    //   // firebase.initializeApp({});
    //   firebase.initializeApp(this.firebaseConfig);
    // }
    // this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    // this.windowRef.recaptchaVerifier.render();


    if(this.acct.checkLoginStatus())
    {
      this.router.navigateByUrl("/"); 
    }

    this.phoneFormControl=new FormControl('',[
      Validators.required,
      Validators.minLength(10),
      Validators.pattern("^[0-9]*$")
    ]);
    // this.displayname=new FormControl('',[Validators.required,Validators.minLength(10)]);

    this.returnUrl=this.route.snapshot.queryParams['returnUrl'] || '/';    //this returns the redirect page url if redirected or returs false, so goes to home page '/'

    this.insertForm=this.fb.group({
      "phoneFormControl":this.phoneFormControl
    });

    this.otpFormControl=new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(6)]);
    this.verificationForm=this.fb.group({
      "otpFormControl":this.otpFormControl
    });

    this.displaynameFormControl=new FormControl('',[Validators.required,Validators.maxLength(50)]);
    this.insertDisplaynameForm=this.fb.group(
      {
        "displaynameFormControl":this.displaynameFormControl
      }
    );
    
  }

  ngAfterViewInit():void
  {
    this.windowRef=this.win.getWindowRef();
    if (firebase.apps.length === 0) {
      // firebase.initializeApp({});
      firebase.initializeApp(this.firebaseConfig);
      console.log('firebase app initialized');
    }

    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    this.windowRef.recaptchaVerifier.render();

    
  }

  

  // loadCapcha():void{
  //   this.windowRef=this.win.getWindowRef();
  //   if (firebase.apps.length === 0) {
  //     // firebase.initializeApp({});
  //     firebase.initializeApp(this.firebaseConfig);

  //     this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  //     this.windowRef.recaptchaVerifier.render();
  //   }

  //   console.log('recaptcha loaded from function');
  // }

  initializeValues()
  {
    this.isRequestInProcess=false;
    this.verificationCodeSend=false;
    this.numberAvailable=0;
    this.activityService.isnotloginPage$.next(false);

    // this.activityService.openCapcha$.subscribe(res=>{

    //   console.log(res);
    //   if(res==true)
    //   {
    //     this.loadCapcha();
    //     this.activityService.openCapcha$.next(false);
    //   }
    // })
  }


  isInsertFormValid():boolean
  {
    if(this.insertForm.valid)
    {
      let appVerifier = this.windowRef.recaptchaVerifier;
      if(appVerifier.g.getResponse().length!=0)
      return true;
    }

    return false;

  }

  openSnackBar(message:string) {
    let msg=message;
    
    this._snackBar.open( msg, 'Close', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    // this._snackBar._openedSnackBarRef.onAction().subscribe(
    //   ()=>{
    //     this.openCart();
    //   }
    // )
  }



  sendLoginCode()
  {
    
    let phoneNumber = this.phoneNumber.tempe164(this.insertForm.controls.phoneFormControl.value); //this.phoneNumber.e164;
    let appVerifier = this.windowRef.recaptchaVerifier;

    // console.log(appVerifier.g.getResponse().length);

    console.log(phoneNumber);
    if(!this.isRequestInProcess)
    {
      this.isRequestInProcess=true;
      firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
            this.windowRef.confirmationResult=confirmationResult;
            this.verificationCodeSend=true;
            this.isRequestInProcess=false;

            this.checknumberavailability$=this.acct.checknumberavailability(this.insertForm.controls.phoneFormControl.value);
            this.checknumberavailability$.subscribe(res=>{
              this.numberAvailable=res;

              console.log('Number available '+res);

            })
        }).catch((error) => {
          this.errorMessage=error;
          this.isRequestInProcess=false;
        });
    }
    


  }

  verifyLoginCode()
  {
    this.isRequestInProcess=true;
    this.windowRef.confirmationResult
      .confirm(this.verificationForm.controls.otpFormControl.value)
      .then(result=>{
        this.user=result.user;
        
        if(this.numberAvailable==1)
        {
            // this.acct.otpLogin(this.insertForm.controls.phoneFormControl.value).subscribe(res=>{
            //   let token=(<any>result).authToken.token;
            //   console.log(token);
            //   console.log(result.authToken.username);
            //   console.log(result.authToken.roles);
            //   console.log("User logged in sucessfully");
            //   this.invalidLogin=false;
            //   this.router.navigateByUrl(this.returnUrl);

            // });
            this.isRequestInProcess=false;
            this.userotplogin(this.insertForm.controls.phoneFormControl.value);


        }
        
      })
      .catch(error=>{
        this.isRequestInProcess=false;
        // console.log(error,'Incorrect code entered')
      //  this.openSnackBar("Incorrect code entered");
      });
  }

  userotplogin(phone:string):void{
    this.isRequestInProcess=true;
    this.acct.otpLogin(phone).subscribe(result=>{
      let token=(<any>result).authToken.token;
      // console.log(token);
      // console.log(result.authToken.username);
      console.log(result.authToken.roles);
      // console.log("User logged in sucessfully");
      this.invalidLogin=false;
      this.isRequestInProcess=false;
      if(result.authToken.roles!='Customer')
      {
        this.activityService.activityStateChange=true;
      }
     
      this.router.navigateByUrl(this.returnUrl); 
      
    });
  }

  onSubmit()
  {
    this.isRequestInProcess=true;
    let registrationData:Register= {"Phone":this.insertForm.controls.phoneFormControl.value,
    "Displayname":this.insertDisplaynameForm.controls.displaynameFormControl.value,
    "Password":"GREENSToP@123","Role":"Customer"};
    this.acct.register(registrationData).subscribe(result=>{
      //this.invalidRegister=true;
      // this.router.navigate(['/login']);
      this.isRequestInProcess=false;
      this.userotplogin(this.insertForm.controls.phoneFormControl.value);
    },error=>{
      this.errorList=[]; 

      this.isRequestInProcess=false;
      for(let i=0;i<error.error.value.length;i++)
      {
        this.errorList.push(error.error.value[i]);
      }
      console.log(this.errorList);
      // this.modalMessage="Your registration was unsuccessful";
      // this.modalref=this.modalService.show(this.modal);
    })
  }

}
