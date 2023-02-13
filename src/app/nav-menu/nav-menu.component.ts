import { Component, OnInit, AfterViewInit, Renderer2 } from '@angular/core';
import { DialogPosition } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { filter } from 'rxjs/operators';
import { CartDialogComponent } from '../dialog/cart-dialog/cart-dialog.component';
import { SidenavDialogComponent } from '../dialog/sidenav-dialog/sidenav-dialog.component';
import { StorageService } from '../service/storage.service';
import { Observable } from 'rxjs';
import { AccountService } from '../service/account.service';
import { CatagoryDetailsService } from '../service/catagory-details.service';
import { ActivityService } from '../service/activity.service';
import { Router } from '@angular/router';
import { OrderService } from '../service/order.service';
import { SwPush } from '@angular/service-worker';
import { NotificationService } from '../service/notification.service';
import { StartupDialogComponent } from '../dialog/startup-dialog/startup-dialog.component';


@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent implements OnInit,AfterViewInit {


  /***************************************************** */
  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger;

  /***************************************************** */

  /********************************************************/ 
    private _subscription: PushSubscription;
    operationName:string=null;
    isNotificationSectionActive:boolean=false;
    // isSubscriptionPossible:boolean=false;

  /********************************************************/

  public itemCount:number=0;
  constructor(public dialog: NgDialogAnimationService,
    private storage:StorageService,
    private _snackBar: MatSnackBar,
    private acct:AccountService,
    private catagoryDetailsService:CatagoryDetailsService,
    private activity:ActivityService,
    private router:Router,
    private ren: Renderer2,
    private orderService:OrderService,
    private swPush: SwPush,
    private notificatonService:NotificationService) {
      //console.log('in request subscription method');
      //this.activity.activityStateChange=false;
      this.swPush.subscription.subscribe((subscription) => {
        this._subscription = subscription;
        //console.log('Entering swPUsh')
        this.operationName = (this._subscription === null) ? 'Allow notifications' : 'Deny notifications';
        console.log(this.operationName);
      });

     }


  
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  loginStatus$ :Observable<boolean>;
  displayName$:Observable<string>;
  userName$:Observable<string>;
  isnotLoginPage$:Observable<Boolean>;
  isAdminSection$:Observable<Boolean>;
  isRoleCustomr$:Observable<Boolean>;
  
  ngOnInit(): void {
    this.storage.itemCount.subscribe(res=>{
      // console.log(res);
      this.itemCount=res;
    });

    this.storage.itemAddedToCart
    .pipe(filter(res=> res===true))
    .subscribe(res=>{
      this.openSnackBar();
    });

    this.storage.orderPlaced.pipe(filter(res=>res==true)).subscribe(res=>{
      this.orderPlacedSnackBar();
    });


    this.loginStatus$=this.acct.isLoggedIn;
    this.loginStatus$
    .pipe(
      filter(rs=>rs==true)
    )
    .subscribe(result=>{
      if(Notification.permission !== 'denied')
      {
        this.isNotificationSectionActive=true;
      }
      
    })
    this.displayName$=this.acct.displayUserName;
    this.userName$=this.acct.currentUserName;
    this.isnotLoginPage$=this.activity.isnotloginPage;

    this.activity.orderSuccessful$.pipe(
      filter(res=>res==true)
    )
    .subscribe(res=>{
      setTimeout(()=>{
        this.activity.orderSuccessful$.next(false);
        console.log('Order Successful');
      },500);

    })

    this.isAdminSection$=this.activity.isAdminSection;
    this.isRoleCustomr$=this.acct.isrolecustomr;

    this.checkandsetCustomerInfo();
    this.showPopUp();

  }

  ngAfterViewInit():void
  {
    this.activity.iscartOpened$
    .pipe(filter(data=> data==true && (this.router.url==='/' || this.router.url==='/home')))
    .subscribe(res=>{
      this.openCart();
      this.activity.iscartOpened$.next(false);
    });

    this.activity.isactivityStateChange
    .pipe(
      filter(x=>x==true)
    )
    .subscribe(res=>{
        // console.log('calling request subscription');
        // this.requestSubsciption();
        console.log('calling notification operation');
        // uncomment the below line
        if(this.operationName!=null)
        {
         this.notificationOperation();
        }
        
        this.activity.activityStateChange=false;
        
    })
  }

  checkandsetCustomerInfo()
  {
    this.acct.isLoggedIn.pipe(
      filter(x=> x==true) // if loged in
    )
    .subscribe(res=>{
      this.storage.isCustomerInfoAvailable
      .pipe(
        filter(resx=> resx==false) // if data not found
      )
      .subscribe(res2=>{
        if(this.storage.getlocalStorage().getItem('jwt')!=null)
        {
          this.orderService.getCustomerInfo().subscribe(customerinfo=>{
            this.storage.setCustomerInfo(customerinfo);
  
            console.log('Customer Info saved');
          })
        }
        
      })
    }) 
  }

  gotoorders()
  {
    console.log('go to orders');
    this.router.navigate(['/order']);
  } 


  openSidenav()
  {
    const dialogPosition: DialogPosition = {
      top: '0px',
      left: '0px'
      // right:'0px'
    };
  
    let width:number= window.innerWidth;
    let widthcss:string='30vw';
    if(width<600)
    {
      widthcss='70vw'
    }
    else if(width<900)
    {
      widthcss='40vw';
    }
    const dialogRef = this.dialog.open(SidenavDialogComponent, {
      width: widthcss,
      // position: dialogPosition,
      position: { rowEnd: "0" },
      data: "item",//{name: this.name, phone: this.phone,email:this.email,type:'user'}
      hasBackdrop:true,
      animation: { to: "right" },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result=>{
      // console.log('done');
    })
  }

  openCart()
  {
    let width:number= window.innerWidth;
    let widthcss:string='30vw';
    if(width<600)
    {
      widthcss='100vw'
    }
    else if(width<900)
    {
      widthcss='50vw';
    }
    const dialogRef = this.dialog.open(CartDialogComponent, {
      width: widthcss,
      position: { right: "0" },
      data: "item",//{name: this.name, phone: this.phone,email:this.email,type:'user'}
      hasBackdrop:true,
      animation: { to: "left" },
      panelClass: 'custom-dialog-container-cart'
    });

    dialogRef.afterClosed().subscribe(result=>{
      // console.log('done');
    }) 
  }

  openSnackBar() {
    let msg=(this.itemCount>1?this.itemCount+' items':this.itemCount+' item');
    
    this._snackBar.open( msg+' in the cart ', 'View cart', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    
    this._snackBar._openedSnackBarRef.onAction().subscribe(
      ()=>{
        this.openCart();
      }
    )

  }

  openGeneralSnackBar(msg:string,section:string)
  {
    this._snackBar.open( msg, section, {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });
  }

  orderPlacedSnackBar()
  {
    let msg='Order placed successfully';
    
    this._snackBar.open( msg, 'View orders',{
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    this._snackBar._openedSnackBarRef.onAction().subscribe(
      ()=>{
        // this.onNoClick();
      //  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        // this.activity.openCapcha$.next(true);
        this.router.navigateByUrl('/order');
      }
    )
  }

  onLogout():void{
    this.catagoryDetailsService.clearCache();
    this.storage.resetAll();
    this.acct.logout();
    if(this._subscription!=null)
    {
      this.activity.activityStateChange=true;
    }

  }

  gotodashboard():void{
    this.router.navigate(['/admin/current-order']);
  }

  /******************************************** */
  menuenter() {
    this.isMatMenuOpen = true;
    if (this.isMatMenu2Open) {
      this.isMatMenu2Open = false;
    }
  }

  menuLeave(trigger, button) {
    setTimeout(() => {
      if (!this.isMatMenu2Open && !this.enteredButton) {
        this.isMatMenuOpen = false;
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenuOpen = false;
      }
    }, 80)
  }

  menu2enter() {
    this.isMatMenu2Open = true;
  }

  menu2Leave(trigger1, trigger2, button) {
    setTimeout(() => {
      if (this.isMatMenu2Open) {
        trigger1.closeMenu();
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        this.enteredButton = false;
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.isMatMenu2Open = false;
        trigger2.closeMenu();
      }
    }, 100)
  }

  buttonEnter(trigger) {
    setTimeout(() => {
      if(this.prevButtonTrigger && this.prevButtonTrigger != trigger){
        this.prevButtonTrigger.closeMenu();
        this.prevButtonTrigger = trigger;
        this.isMatMenuOpen = false;
        this.isMatMenu2Open = false;
        trigger.openMenu();
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      else if (!this.isMatMenuOpen) {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
        trigger.openMenu();
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(trigger.menu.items.first['_elementRef'].nativeElement, 'cdk-program-focused');
      }
      else {
        this.enteredButton = true;
        this.prevButtonTrigger = trigger
      }
    })
  }

  buttonLeave(trigger, button) {
    setTimeout(() => {
      if (this.enteredButton && !this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } if (!this.isMatMenuOpen) {
        trigger.closeMenu();
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-focused');
        this.ren.removeClass(button['_elementRef'].nativeElement, 'cdk-program-focused');
      } else {
        this.enteredButton = false;
      }
    }, 100)
  }

  // private requestSubsciption()
  // {
    // console.log('in request subscription method');
    // this.activity.activityStateChange=false;
    // this.swPush.subscription.subscribe((subscription) => {
    //   this._subscription = subscription;
    //   console.log('Entering swPUsh')
    //   this.operationName = (this._subscription === null) ? 'Subscribe' : 'Unsubscribe';
    //   console.log(this.operationName);
      // (this._subscription === null) ? this.subscribe() : this.unsubscribe(this._subscription.endpoint);
    // });

    // let isEnabled = this.swPush.isEnabled;
    // let isGranted = Notification.permission === 'granted';
    
    // (this._subscription === null) ? this.subscribe() : this.unsubscribe(this._subscription.endpoint);
    
  // }

  notificationOperation() {
    console.log('inside notification operation');
    (this._subscription === null) ? this.subscribe() : this.unsubscribe(this._subscription.endpoint);
   };


  private subscribe() {
    console.log('calling subscribe');
    this.notificatonService.getPublicKey().subscribe(publicKey=>{
      // Request subscription with the service worker
      console.log(publicKey);
      this.swPush.requestSubscription({
        serverPublicKey: publicKey.publicKey
      })
      .then(subscription =>
        this.notificatonService.pushSubscriptionPost(subscription)
        .subscribe(
          () => {
            this.operationName='Deny notifications';
            this.openGeneralSnackBar('Notifications allowed','Greenstop');
            // this.operationName = (this._subscription === null) ? 'Allow notifications' : 'Deny notifications';
           },
          error => console.error('Could not subscribe to server',error)
        )
        // console.log(subscription.endpoint,subscription.getKey('p256dh'),subscription.getKey('auth'))
      )
      .catch(err => console.error('Could not subscribe to notifications', err));
    },
    error=>{
      console.error('Could not get public key ',error);
    })
  };
  
  private unsubscribe(endpoint) { 
    console.log('calling unsubscribe');
    let isEnabled = this.swPush.isEnabled;
    let isGranted = Notification.permission === 'granted';
    if(isEnabled && isGranted)
    {
      this.swPush.unsubscribe()
      .then(()=>this.notificatonService.deleteSubscription(endpoint).subscribe(()=>{
        this.operationName='Allow notifications';
        this.openGeneralSnackBar('Notifications disabled','Greenstop');
      },
        error=>console.error(error)
      ))
      .catch(error => console.error(error));
    }
    
  }

  showPopUp()
  {
    if(this.storage.getsessionStorage().getItem("showPopUp")==null)
    {
      this.openStartupDialog();
      this.storage.getsessionStorage().setItem("showPopUp","1");
    }
  }

  openStartupDialog()
  {
    const dialogRef2 = this.dialog.open(StartupDialogComponent, {
      width: '300px',
      // data: {name: this.name, phone: this.phone,email:this.email,type:'user'}
      data:''
    });
  }

  /******************************************** */
}
