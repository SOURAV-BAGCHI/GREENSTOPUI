import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OtpPaymentDetails } from 'src/app/models/otp-payment-details';
import { PaymentInfoDetails } from 'src/app/models/payment-info-details';
import { AdminService } from 'src/app/service/admin.service';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-v-otp-and-complete-o',
  templateUrl: './v-otp-and-complete-o.component.html',
  styleUrls: ['./v-otp-and-complete-o.component.css']
})
export class VOtpAndCompleteOComponent implements OnInit { 

  constructor(public dialogRef: MatDialogRef<VOtpAndCompleteOComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OtpPaymentDetails,
    private adminService:AdminService,
    private _formBuilder: FormBuilder,
    private snackbar:SnackbarService) { }

  otp_verified:boolean=false;
  isLinear = false;
  otpFormGroup: FormGroup;
  ispayment
  paymentInfoFormGroup: FormGroup;
  payment_received:boolean;
  payment_mode=[];
  isloadingData:boolean=false;
  success:number=0;
  


  // isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;


  ngOnInit(): void {
    this.otpFormGroup=this._formBuilder.group({
      otpCtrl:['',[Validators.required,Validators.minLength(4)]]
    })
    this.paymentInfoFormGroup = this._formBuilder.group({
        paymentPresentCtrl:[{value: true, disabled: true},[Validators.required]],
        paymentModelCtrl: ['', [Validators.required]],
        amountCtrl:[{value: this.data.amount, disabled: true},[Validators.required]],
        transactionIdCtrl:['']
      }); 

    // this.firstFormGroup = this._formBuilder.group({
    //   firstCtrl: ['', Validators.required]
    // });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  checkotp()
  {
    let code:string=this.otpFormGroup.controls.otpCtrl.value;
    this.isloadingData=true;
    this.adminService.CheckOtp(this.data.orderid,code).subscribe(res=>{
      this.otp_verified=res;
      if(this.otp_verified)
      {
        this.payment_mode=[ 
          {value: 1, viewValue: 'Cash'},
          {value: 2, viewValue: 'UPI'},
          {value: 2, viewValue: 'Card'}
        ]
      }
      else
      {
        this.snackbar.openSnackBar("Incorrect code","Try again");
      }
      this.isloadingData=false;
    },
    error=>{
      this.snackbar.openSnackBar("Something went wrong","Error");
      this.isloadingData=false;
    })
  }

  submitPaymentInfo()
  {
    console.log(this.paymentInfoFormGroup.controls);
    if(this.paymentInfoFormGroup.controls.paymentPresentCtrl.value)
    {
      let paymentinfo:PaymentInfoDetails={Mode:this.paymentInfoFormGroup.controls.paymentModelCtrl.value,
      Amt:this.paymentInfoFormGroup.controls.amountCtrl.value,
      TId:this.paymentInfoFormGroup.controls.transactionIdCtrl.value,
      OrderId:this.data.orderid
    };
      this.isloadingData=true;
      this.adminService.UpdatePaymentInfo(paymentinfo).subscribe(res=>{
        // console.log(res);
        this.success=2;
        this.onNoClick();
        this.isloadingData=false;
      },
      error=>{
        console.log(error);
        this.isloadingData=false;
      })
    }
    else
    {
      this.success=1;
      this.onNoClick();
    }
  }

  onNoClick(): void {
    this.dialogRef.close(this.success);
  }
}
