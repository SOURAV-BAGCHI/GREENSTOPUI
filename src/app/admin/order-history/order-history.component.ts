import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator/paginator';
import { Observable } from 'rxjs';
import { config } from 'src/app/config';
import { OrderDetailsDialogComponent } from 'src/app/dialog/order-details-dialog/order-details-dialog.component';
import { OrderStatusLogComponent } from 'src/app/dialog/order-status-log/order-status-log.component';
import { RoleEmployeeDialogComponent } from 'src/app/dialog/role-employee-dialog/role-employee-dialog.component';
import { VOtpAndCompleteOComponent } from 'src/app/dialog/v-otp-and-complete-o/v-otp-and-complete-o.component';
import { OrderDetails } from 'src/app/models/order-details';
import { OtpPaymentDetails } from 'src/app/models/otp-payment-details';
import { TimeSlotDetails } from 'src/app/models/time-slot-details';
import { AccountService } from 'src/app/service/account.service';
import { AdminService } from 'src/app/service/admin.service';
import { OrderService } from 'src/app/service/order.service';

export interface PeriodicElementXXX {
  name: string;
  position: number;
  weight: number;
  symbol: string;
  description: string;
}

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class OrderHistoryComponent implements OnInit {

  constructor(private orderService:OrderService,
    private acct:AccountService,
    private adminService:AdminService,
    private fb:FormBuilder,
    private dialog: MatDialog) { }
  
     //dataSource = ELEMENT_DATA;
     columnsToDisplay = ['sl','name', 'total', 'delivery', 'timeslot'];
     expandedElement: PeriodicElementXXX| null;
 
   private currentOrderDetails$:Observable<OrderDetails[]>;
   currentOrderDetails:OrderDetails[]=[];
   dateString:string='none';
   deliveryTimeid:number=0;
   isLoadingResults:boolean=false;
   dataSource:any;
   role:string='';
   statusOrderComplete:number=8;
 
   pageCount:Number=0;
   pageOffsetCount:number=1; 
   currentPage:number=1; 
   pageSize:number=10;
   currentpageIndex:number=0; 
 
   // @ViewChild('table') table: MatTable<Element>;
   @ViewChild('paginator') paginator: MatPaginator;
   private currentUserRole$:Observable<string>;
 
   // columnsToDisplay = ['orderId'];
   datetimegroup:FormGroup;
   timeslots: TimeSlotDetails[] = [];
   downloadFile:string=config.hostname+'api/Order/GetOrderDocument/';
  
   ngOnInit(): void {
     // this.GetEmployeeByRole("2",0);
     this.currentUserRole$=this.acct.currentUserRole;
     // this.currentUserRole$.subscribe(res=>{
     //   this.role=res;
     // });
 
     this.datetimegroup=this.fb.group({
       deliverydtCtrl:[''],
       deliverytimeCtrl:[0]
     });
 
     this.datetimegroup.controls.deliverydtCtrl.valueChanges.subscribe(res=>{
       // let now=moment([res.getFullYear(),res.getMonth(),res.getDate()]);
       this.dateString=res.format("DD-MM-yyyy");
     });
 
     this.datetimegroup.controls.deliverytimeCtrl.valueChanges.subscribe(res=>{
       this.deliveryTimeid=res;
     });
 
     this.loadTimeslot();
     
     this.GetDataCount();
     this.loadData(0);
   }
    
   loadTimeslot() {
     this.timeslots = [
       {value: '0', viewValue: 'All day'},
       {value: '1', viewValue: '11 am - 12 pm'},
       {value: '2', viewValue: '12 pm - 1 pm'},
       {value: '3', viewValue: '1 pm - 2 pm'},
       {value: '4', viewValue: '2 pm - 3 pm'},
       {value: '5', viewValue: '3 pm - 4 pm'},
       {value: '6', viewValue: '4 pm - 5 pm'},
       {value: '7', viewValue: '5 pm - 6 pm'},
       {value: '8', viewValue: '6 pm - 7 pm'}, 
       {value: '9', viewValue: '7 pm - 8 pm'},
       {value: '10', viewValue: '8 pm - 9 pm'},
       {value: '11', viewValue: '9 pm - 10 pm'}
     ];
   }
 
   setCustomerServiceStatus(orderid:string,customerservicestatus:string,index:number)
   {
     index-=1;
     this.isLoadingResults=true;
     this.adminService.SetCustomerServiceStatus(orderid,customerservicestatus).subscribe(res=>{
       this.dataSource[index].CustomerServiceStatus=customerservicestatus;
       this.isLoadingResults=false;
     },
     error=>{
       console.log('Error updating data'+error);
       this.isLoadingResults=false;
     })
   }
 
   SetOrderAction(orderid:string,useridto:string,status:number,index:number)
   {
     this.isLoadingResults=true;
     this.adminService.SetOrderAction(orderid,useridto,status).subscribe(res=>{
       this.dataSource[index].OrderStatus=status;
       this.isLoadingResults=false;
       if(status==this.statusOrderComplete)
       {
         this.GetDataCount();
         this.loadData(0);
       }
     },
     error=>{
       console.log('Error updating data'+error);
       this.isLoadingResults=false;
     })
   }
 
   AssignOrder(orderid:string,status:number,index:number)
   {
     const dialogRef = this.dialog.open(RoleEmployeeDialogComponent, {
       width: '300px',
       // data: {name: this.name, phone: this.phone,email:this.email,type:'user'}
       data:status
     });
     dialogRef.afterClosed().subscribe(result => {
       if(result!=undefined)
       {
         this.SetOrderAction(orderid,result,status,index);
       }
     });
   } 
 
   verifyotpAndSetPaymentInfo(orderid:string,useridto:string,status:number,amount:number,index:number)
   {
     let otpPaymentdetails:OtpPaymentDetails={orderid:orderid,amount:amount,status:status};
     const dialogRef2 = this.dialog.open(VOtpAndCompleteOComponent, {
       width: '300px',
       // data: {name: this.name, phone: this.phone,email:this.email,type:'user'}
       data:otpPaymentdetails
     });
     dialogRef2.afterClosed().subscribe(result => {
       if(result!=undefined)
       {
         
         
         if( result!="" && result>0)
         {
           this.SetOrderAction(orderid,useridto,status+result-1,index);
         }
         
       }
     });
   }
 
   GetEmployeeByRole(roleid:string,lastrecord:number=0)
   {
     this.adminService.GetEmployeeByRole(roleid,lastrecord).subscribe(res=>{
       console.log(res);
     },
     error=>{
       
     })
 
   }
 
   GetDataCount()
   {
     this.orderService.getOrderDetailsHistoryCount(this.dateString,this.deliveryTimeid).subscribe(res=>{
       this.pageCount=res.count;
       // console.log(res);
     });
   }
 
   loadData(pagenumber:number):void{
     this.isLoadingResults=true;
     
     this.orderService.getOrderDetailsHistory(this.dateString,this.deliveryTimeid,pagenumber).subscribe(res=>{
       
       this.dataSource=res;
       
       this.currentpageIndex=pagenumber;
       this.isLoadingResults=false;
     },
     error=>{
       this.isLoadingResults=false;
     })
   }
  
   GetOrderDetails(index:number)
   {
     const dialogRef3 = this.dialog.open(OrderDetailsDialogComponent, {
       // width: '300px',
       // data: {name: this.name, phone: this.phone,email:this.email,type:'user'}
       data:this.dataSource[index]
     });
     dialogRef3.afterClosed().subscribe(result => {
       
     });
   }

   GetOrderStatusLog(index:number)
   {
    const dialogRef4 = this.dialog.open(OrderStatusLogComponent, {
      // width: '300px',
      // data: {name: this.name, phone: this.phone,email:this.email,type:'user'}
      data:this.dataSource[index]
    });
    dialogRef4.afterClosed().subscribe(result => {
      
    });
   }
 
   searchOrders()
   {
     this.GetDataCount();
     this.loadData(0);
     this.paginator.firstPage();
   }
 
   onPageFired(event){
     //  console.log(event.pageIndex);
       this.loadData(event.pageIndex);
     }

}
