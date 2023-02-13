import { AfterViewInit, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PinAvailabilityDetails } from 'src/app/models/pin-availability-details';
import { StorageItem } from 'src/app/models/storage-item';
import { CheckoutService } from 'src/app/service/checkout.service';
import { StorageService } from 'src/app/service/storage.service';
import { config } from 'src/app/config';
import { WindowService } from 'src/app/service/window.service';
import { ViewChild } from '@angular/core';
import * as moment from 'moment';
import { TimeSlotDetails } from 'src/app/models/time-slot-details';
import { AccountService } from 'src/app/service/account.service';
import { ActivityService } from 'src/app/service/activity.service';
import { Router } from '@angular/router';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition, MatSnackBar } from '@angular/material/snack-bar';
import { OrderDetails } from 'src/app/models/order-details';
import { OrderService } from 'src/app/service/order.service';
import { filter } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';


export class PhoneNumber{
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
  selector: 'app-cart-dialog',
  templateUrl: './cart-dialog.component.html',
  styleUrls: ['./cart-dialog.component.css']
})
export class CartDialogComponent implements OnInit,AfterViewInit {

  constructor(
    public dialogRef:MatDialogRef<CartDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:string,
    private storage:StorageService,
    private _formBuilder: FormBuilder,
    private checkoutService:CheckoutService,
    private win:WindowService,
    private acct:AccountService,
    private activity:ActivityService,
    private router:Router,
    private _snackBar: MatSnackBar,
    private orderService:OrderService
  ) { }

  public itemCount:number=0;
  public storageItemList:StorageItem[]=[];
  public doCheckout:boolean=false;
  public pincodeAvailable:boolean=false;
  public isloadingData:boolean=false;
  public isError:boolean=false;
  public userPincodeDetails:PinAvailabilityDetails;
  public pincodeChecked:boolean=false;
  private firebaseConfig=config.firebaseConfig;
  public now=moment();
  public limitDate=moment();
  minOrderDate: Date;
  private orderDetails:OrderDetails;
  private userdisplayname:string;
  public orderamtleftforthreshold:number=0;

  public subTotal:number=0;
  public deliveryCharges:number=0;
  @ViewChild('last') last:ElementRef;
  lastElement:string='lastElement';
  userDetailsCls:string='userDetailsCls';
  primary_ending:string='primary-ending';


  windowRef:any;
  phoneNumber=new PhoneNumber();
  verificationCode:string;
  user:any;
  tax:number=0;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup:FormGroup;
  isEditable = false;
  
  timeslots: TimeSlotDetails[] = [];
    
  isLoggedIn:boolean=false;
  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom'; 
  public showcancellationPolicy:boolean=false;
  public acceptTermsAndConditions:boolean=false;

  customerInfo:any=null;

  showNextSection:boolean=false;

  ngOnInit(): void {

    // checkforCustomerInfo();

    this.orderDetails={OrderId:"",UserId:"",CustomerInfo:"",ItemDetails:"",CreateDate:"",OrderStatus:0,OrderStatusLog:"none",
    PaymentStatus:false,DeliveryDate:"",DeliveryTimeId:0,PaymentInfo:"",SubTotal:0.0,Tax:0.0,DeliveryCharges:0.0,CustomerServiceStatus:"0"};

    this.storage.itemList.subscribe(res=>{
      this.storageItemList=res;
      console.log(this.storageItemList);
      
      this.itemCount=this.storageItemList.length;
      this.calculateSubTotal();

      this.acct.isLoggedIn.subscribe(res=>{
        this.isLoggedIn=res;
      })

      if(this.itemCount>0)
      {
        setTimeout(()=>{
          this.scrollToClass(this.primary_ending);
        },1500);
      }
    });

    let tempPincode:string='';
    this.loadcustomerInfo();
    if(this.customerInfo!=null)
      tempPincode=this.customerInfo.Pincode;

    
      this.firstFormGroup = this._formBuilder.group({
        firstCtrl: [tempPincode, [Validators.required,Validators.minLength(6),Validators.maxLength(6),Validators.pattern("^[0-9]*$")]]
      });
  
      
      this.secondFormGroup = this._formBuilder.group({
        secondCtrl: ['', [Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.pattern("^[0-9]*$")]]
      });
  
      this.thirdFormGroup=this._formBuilder.group({
        addressLine1Ctrl:['',[Validators.required,Validators.maxLength(100)]],
        addressLine2Ctrl:['',[Validators.maxLength(100)]], //Validators.required,
        landmarkCtrl:['',[Validators.required,Validators.maxLength(100)]],
        phoneCtrl:[{value: '', disabled: true},[Validators.required]], //this.secondFormGroup.controls.secondCtrl.value
        pinCtrl:[{value: '', disabled: true},[Validators.required]], //this.firstFormGroup.controls.firstCtrl.value
        altphoneCtrl:[''],
        deliveryDtTime:['',[Validators.required]],
        timeslotCtrl:['',[Validators.required]],
        DeliveryInstructionCtrl:[''],
        PaymentModeCtrl:['1',[Validators.required]]
      })

      this.thirdFormGroup.controls.timeslotCtrl.valueChanges.subscribe(res=>{
        setTimeout(() => {
            this.scrollToClass(this.lastElement);
        }, 500);
      })

    this.limitDate.hour(19);
    this.limitDate.minute(0);
    this.limitDate.second(0);


    this.minOrderDate= (this.now.isBefore(this.limitDate)?this.limitDate.add(1,'days').toDate():this.limitDate.add(2,'days').toDate()); // true
    this.setDeliveryTimeSlot();
    
  }

  changeOrderQuantity(id:number,timestamp:number,quantity:number,index:number)
  {
    timestamp=this.storageItemList[index].timestamp;
   
    if(this.storage.addItem(id,timestamp,quantity))
    {
      this.storageItemList[index].quantity+=quantity;
      this.calculateSubTotal();
      if(this.pincodeAvailable)
      {
        this.checkPincodeAvailability(false);
      }
    }
    
  }

  public setDeliveryTimeSlot()
  {
    this.timeslots = [
      // {value: '1', viewValue: '11 am - 12 pm'},
      // {value: '2', viewValue: '12 pm - 1 pm'},
      {value: '3', viewValue: '1 pm - 2 pm'},
      {value: '4', viewValue: '2 pm - 3 pm'},
      {value: '5', viewValue: '3 pm - 4 pm'},
      {value: '6', viewValue: '4 pm - 5 pm'},
      {value: '7', viewValue: '5 pm - 6 pm'},
      {value: '8', viewValue: '6 pm - 7 pm'}, 
      {value: '9', viewValue: '7 pm - 8 pm'}//,
      // {value: '10', viewValue: '8 pm - 9 pm'},
      // {value: '11', viewValue: '9 pm - 10 pm'}
    ];
  }
 
  public calculateSubTotal()
  {
    this.subTotal=0;
    this.storageItemList.forEach(element => {
      this.subTotal+=element.price*element.quantity
    });
  }

  openSnackBar(message:string,messagetype:string='Login') {
    let msg=message;
    
    this._snackBar.open( msg, messagetype, {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    if(messagetype=='Login')
    {
      this._snackBar._openedSnackBarRef.onAction().subscribe(
        ()=>{
          this.onNoClick();
        //  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
          // this.activity.openCapcha$.next(true);
          this.router.navigateByUrl('/user/login');
        }
      )
    }
    
  }

  scroll(el: HTMLElement) {
    el.scrollIntoView();
  }
  scrollToClass(elementCls:string):void
  {
  //  console.log(elementCls);
    let el=document.getElementsByClassName(elementCls);
  //  console.log(el);
    if(el.length>0){
      el[0].scrollIntoView({behavior:"smooth"});
    }
    else
    {
      console.log(elementCls +' is not found');
    }
    
  }

  ngAfterViewInit():void{
    // firebase.initializeApp(this.firebaseConfig);

    // this.windowRef=this.win.getWindowRef();
    // this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    // this.windowRef.recaptchaVerifier.render();
  
  //  this.windowRef=this.win.getWindowRef();
    // if (firebase.apps.length === 0) {
    //   // firebase.initializeApp({});
    //   firebase.initializeApp(this.firebaseConfig);
    // }
    
  }

  doCheckoutUser()
  {

    if(!this.isLoggedIn)
    {
    //  this.activity.iscartOpened$.next(true);
    //  this.router.navigateByUrl('/user/login');
      
      this.openSnackBar('Login to continue');
    }
    else
    {
      this.doCheckout=true;
      

      
      // this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
      // this.windowRef.recaptchaVerifier.render();

      setTimeout(()=>{
        this.scroll(this.last.nativeElement);
      },300);
      
      this.thirdFormGroup.controls.phoneCtrl.setValue(this.secondFormGroup.controls.secondCtrl.value);
      this.thirdFormGroup.controls.pinCtrl.setValue(this.firstFormGroup.controls.firstCtrl.value);

    }
    
  }

  placeOrder()
  {
    let modeofpayment:number=parseInt(this.thirdFormGroup.controls.PaymentModeCtrl.value,10);

    let customerInfo:any={  Name:this.userdisplayname,
                            AddressLine1:this.thirdFormGroup.controls.addressLine1Ctrl.value,
                            AddressLine2:this.thirdFormGroup.controls.addressLine2Ctrl.value,
                            Landmark:this.thirdFormGroup.controls.landmarkCtrl.value,
                            Phone:this.thirdFormGroup.controls.phoneCtrl.value,
                            Pincode:this.thirdFormGroup.controls.pinCtrl.value,
                            AlternatePhone:this.thirdFormGroup.controls.altphoneCtrl.value,
                            DeliveryInstruction:this.thirdFormGroup.controls.DeliveryInstructionCtrl.value,
                            PaymentMode:modeofpayment
                          };
    let itemDetails=[];
    this.storageItemList.forEach(element => {
      itemDetails.push({id:element.id,name:element.name,price:element.price,quantity:element.quantity,note:element.note});
    });

    let deliverydate=this.thirdFormGroup.controls.deliveryDtTime.value;

    // console.log(deliverydate.format("YYYY-MM-DD")+"T00:00:00");
    // let now=moment([deliverydate.getFullYear(),deliverydate.getMonth(),deliverydate.getDate()]);

    let paymentInfo={Mode:modeofpayment,Amt:this.subTotal+this.deliveryCharges,TId:""};


    this.orderDetails.OrderId="none";
    this.orderDetails.UserId="0000";
    this.orderDetails.CustomerInfo=JSON.stringify(customerInfo);
    this.orderDetails.ItemDetails=JSON.stringify(itemDetails);  
    this.orderDetails.CreateDate="2021-01-23T00:00:00";   
    this.orderDetails.OrderStatus=0;
    this.orderDetails.OrderStatusLog="none";
    this.orderDetails.PaymentStatus=false;
    this.orderDetails.DeliveryDate=deliverydate.format("YYYY-MM-DD")+"T00:00:00";
    this.orderDetails.DeliveryTimeId=parseInt( this.thirdFormGroup.controls.timeslotCtrl.value,10);
    this.orderDetails.PaymentInfo=JSON.stringify(paymentInfo);
    this.orderDetails.SubTotal=this.subTotal;
    this.orderDetails.Tax=0.00;
    this.orderDetails.DeliveryCharges=this.deliveryCharges;

    
    



  //  console.log(this.orderDetails);

    this.isloadingData=true;
    this.orderService.createOrder(this.orderDetails).subscribe(res=>{
      this.isloadingData=false;
      this.storage.setCustomerInfo(customerInfo);
      this.storage.orderPlaced.next(true);
      this.storage.resetAll();
      this.onNoClick();
      this.activity.orderSuccessful$.next(true);
    },
    error=>{
      this.isloadingData=false;
      this.openSnackBar('Error processing order, try again later',"Error");
    })

   
  }

  loadCaptche()
  {
    // setTimeout(()=>{
    //   this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
    //   this.windowRef.recaptchaVerifier.render();
    // },300);

  //  console.log('Ok here we go');
    this.showNextSection=true;
    if(this.customerInfo!=null)
    {
    //  console.log('Ok here we go');
      if(this.firstFormGroup.controls.firstCtrl.value==this.customerInfo.Pincode)
      {

        this.thirdFormGroup.controls.addressLine1Ctrl.setValue(this.customerInfo.AddressLine1);
        this.thirdFormGroup.controls.addressLine2Ctrl.setValue(this.customerInfo.AddressLine2);
        this.thirdFormGroup.controls.landmarkCtrl.setValue(this.customerInfo.Landmark);
        this.thirdFormGroup.controls.phoneCtrl.setValue(this.customerInfo.Phone);
        // this.thirdFormGroup.controls.phoneCtrl.setValue(this.secondFormGroup.controls.secondCtrl.value);
        this.thirdFormGroup.controls.altphoneCtrl.setValue(this.customerInfo.AlternatePhone);
        this.thirdFormGroup.controls.DeliveryInstructionCtrl.setValue(this.customerInfo.DeliveryInstruction);
        this.thirdFormGroup.controls.PaymentModeCtrl.setValue(this.customerInfo.PaymentMode.toString());


        // this.thirdFormGroup.controls.phoneCtrl.setValue(this.secondFormGroup.controls.secondCtrl.value);
        this.thirdFormGroup.controls.pinCtrl.setValue(this.firstFormGroup.controls.firstCtrl.value);


      //  console.log('Same pincode!!! hurray')
      }

      setTimeout(()=>{
        this.scrollToClass(this.userDetailsCls);
      },500);
    }



  }


  loadcustomerInfo():void{

    this.storage.customerInfoDetails
    .pipe(
      filter(x=> x!=null)
    )
    .subscribe(res=>{
      this.customerInfo=res;
      // console.log('this is customer info');
      // console.log(res);
    })


    
  }

  sendLoginCode()
  {
    // let phoneNumber = this.phoneNumber.tempe164(this.secondFormGroup.controls.secondCtrl.value); //this.phoneNumber.e164;
    // let appVerifier = this.windowRef.recaptchaVerifier;
    // firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    //     .then((confirmationResult) => {
    //         this.windowRef.confirmationResult=confirmationResult;
    //         setTimeout(()=>{
    //           this.scroll(this.last.nativeElement);
    //         },300);
    //       // ...
    //     }).catch((error) => {
          
    //       console.log(error);
    //     });


  }

  verifyLoginCode()
  {
    // this.windowRef.confirmationResult
    //               .confirm(this.verificationCode)
    //               .then(result=>{
    //                 this.user=result.user;
    //                 setTimeout(()=>{
    //                   this.scroll(this.last.nativeElement);
                      
                      

    //                 },300);
    //               })
    //               .catch(error=>console.log(error,'Incorrect code entered'));
  }

  removeItem(timestamp:number)
  {
    this.storage.removeItem(timestamp);
    if(this.pincodeAvailable)
    {
      this.checkPincodeAvailability(false);
    }
  }

  checkPincodeAvailability(setScroll:boolean=true)
  {
    this.isloadingData=true;
    this.userPincodeDetails=this.checkoutService.checkPincodeAvailability(this.firstFormGroup.controls.firstCtrl.value,this.subTotal);
    // console.log(this.firstFormGroup.controls.firstCtrl.value);
    // console.log(this.userPincodeDetails);

    this.pincodeAvailable=(this.userPincodeDetails.pincode!="None"?true:false);

    this.isloadingData=false;
    this.pincodeChecked=true;

    if(this.pincodeAvailable)
    {
      this.showNextSection=true;

      this.acct.currentUserName.subscribe(res=>{
        this.thirdFormGroup.controls.phoneCtrl.setValue(res);
      })

      this.acct.displayUserName.subscribe(res=>{
        this.userdisplayname=res;
      })

      // this.deliveryCharges=(this.subTotal>=this.userPincodeDetails.thresholdamt?0:this.userPincodeDetails.deliveryCharge);
      this.deliveryCharges=this.userPincodeDetails.deliveryCharge;

      if(this.deliveryCharges>0)
      {
        this.orderamtleftforthreshold=this.userPincodeDetails.thresholdamt-this.subTotal;
      }
      else
      {
        this.orderamtleftforthreshold=0;
      }
      
    //  console.log(this.orderamtleftforthreshold);
      this.thirdFormGroup.controls.pinCtrl.setValue(this.firstFormGroup.controls.firstCtrl.value);
      if(setScroll)
      {
        setTimeout(() => {
          this.scrollToClass(this.lastElement);
        }, 200);
      }
      
      
    }
    else
    {
      this.showNextSection=false;
    }

  }

  togglecancellationsection()
  {
    this.showcancellationPolicy=!this.showcancellationPolicy;
    if(this.showcancellationPolicy)
    {
      setTimeout(() => {
        this.scrollToClass(this.lastElement);
      }, 500);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  scrolltobottom()
  {
    // let width:number= window.innerWidth;
    // let widthcss:string='30vw';
    // if(width<600)
    // {
    //   widthcss='100vw'
    // }
    // else if(width<900)
    // {
    //   widthcss='50vw';
    // }

    setTimeout(() => {
      if(this.acceptTermsAndConditions)
      {
        this.scrollToClass("primary-ending2");
      }
    }, 500);

  }

}
