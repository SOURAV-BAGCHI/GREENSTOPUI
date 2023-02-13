import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { fromEvent, timer, Subject, Observable } from 'rxjs';
import { take, takeLast, map, takeUntil } from 'rxjs/operators';
import { CatagoryDetailsService } from '../service/catagory-details.service';
import { Catagory } from '../models/catagory';
import { DialogPosition, MatDialog } from '@angular/material/dialog';
import { TestDialogComponent } from '../dialog/test-dialog/test-dialog.component';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AccountService } from '../service/account.service';
import { OrderService } from '../service/order.service';
import { Router } from '@angular/router';
import { ActivityService } from '../service/activity.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class TestComponent implements OnInit,OnDestroy {

  constructor(private _formBuilder: FormBuilder,
    private acct:AccountService,
    private router:Router,
    private activityService:ActivityService) 
  { }
  
  isRequestInProcess:boolean=false;

  firstFormGroup: FormGroup;  
  phoneFormControl:FormControl;
  returnUrl:string='/';

  ngOnInit(): void {
    this.phoneFormControl=new FormControl('',[
      Validators.required,
      Validators.minLength(10),
      Validators.pattern("^[0-9]*$")
    ]);

    this.firstFormGroup=this._formBuilder.group(
      {
        "phoneControl":this.phoneFormControl
      }
    );
  }

  onSubmit()
  {
    // console.log(this.firstFormGroup.controls.phoneControl.value);
    this.userotplogin(this.firstFormGroup.controls.phoneControl.value);
  }

  userotplogin(phone:string):void{
    this.isRequestInProcess=true;
    this.acct.otpLogin(phone).subscribe(result=>{
      let token=(<any>result).authToken.token;
      console.log(token);
      console.log(result.authToken.username);
      console.log(result.authToken.roles);
      console.log("User logged in sucessfully");
      
      this.isRequestInProcess=false;
      if(result.authToken.roles!='Customer')
      {
        this.activityService.activityStateChange=true;
      }
      this.router.navigateByUrl(this.returnUrl); 
      
    });
  }

  ngOnDestroy():void{
    
  }
  
}
