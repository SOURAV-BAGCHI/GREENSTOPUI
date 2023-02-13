import { Component, OnInit } from '@angular/core';
import { OrderDetailsSmall } from 'src/app/models/order-details-small';
import { OrderService } from 'src/app/service/order.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { GenerallistDetails } from 'src/app/models/generallist-details';
import { Router } from '@angular/router';
import { WindowService } from 'src/app/service/window.service';
import { GeneralService } from 'src/app/service/general.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

  constructor(private orderService:OrderService,
              private _snackBar: MatSnackBar,
              private router:Router,
              private windowref:WindowService,
              private generalService:GeneralService) { }

  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  
  orderlist:OrderDetailsSmall[]=null;
  requestinprocess:boolean=false;
  panelOpenState:boolean=false;
  

  pageCount:Number=0;
  pageOffsetCount:number=1;
  currentPage:number=1;
  pageSize:number=10;
//  pageIndex:number=0;
  isLoadingData:boolean;
  isOrderActionActive:boolean[]=new Array(this.pageSize).fill(false);
  ngOnInit(): void {

    this.GetDataCount();
    this.loadData(0);
     

  }
  GetDataCount()
  {
    this.orderService.getOrderDetailsMinCount().subscribe(res=>{
      this.pageCount=res.count;
      // console.log(res);
    });
  }

  loadData(pagenumber:number)
  {
    this.requestinprocess=true;
    // this.orderlist.push({name_list:['fish','chicken','mango sauce'],total:546.22,status:1,orderdate:new Date(),deliverydate:new Date(),deliverytime:'11 am - 1 pm',orderid:'ODR20210225132647896',code:'1452'});
    // this.orderlist.push({name_list:['tomato sauce','mango sauce'],total:46.22,status:1,orderdate:new Date(),deliverydate:new Date(),deliverytime:'10 am - 11 am',orderid:'ODR20210225132647833',code:'1452'})
    // this.orderlist.push({name_list:['fish'],total:500.22,status:3,orderdate:new Date(),deliverydate:new Date(),deliverytime:'11 am - 1 pm',orderid:'ODR20210225132647822',code:'1492'})
    // this.orderlist.push({name_list:['chicken'],total:346.22,status:9,orderdate:new Date(),deliverydate:new Date(),deliverytime:'2 pm - 3 pm',orderid:'ODR20210225132647811',code:'1852'})
    // this.orderlist.push({name_list:['fish','chicken','mango sauce'],total:546.22,status:8,orderdate:new Date(),deliverydate:new Date(),deliverytime:'4 pm - 7 pm',orderid:'ODR20210225132647800',code:'2000'})

    this.orderService.getOrderDetailsMin(pagenumber).subscribe(res=>{
      // console.log(res);
      this.orderlist=res;
      // console.log(this.orderlist);
      this.requestinprocess=false; 
      this.windowref.scrollToTop();
      this.isOrderActionActive=new Array(this.orderlist.length).fill(false);
    },
    error=>{
      this.requestinprocess=false; 
    })

    
  }

  cancelOrder(index:number):void{

    this.requestinprocess=true;
    this.isOrderActionActive[index]=true;
    this.generalService.getServerDateTime().subscribe(res=>{
    
    // console.log(res["dateTime"]);
    // let now=moment(res["dateTime"]);
    // console.log(now);
    // this.requestinprocess=false;

    // let now=moment(new Date());
    let now=moment(res["dateTime"]);
     now=now.add(-330,'minutes');
    // console.log(now.format());
    let deliverydate=moment(this.orderlist[index].deliverydate);
    let orderdate=moment(this.orderlist[index].orderdate);
    
    let datediff=deliverydate.diff(now,'days');
    // console.log('datediff' +datediff);
    
    // console.log('now' +now.format());
    // console.log('delivery dt' + deliverydate.format());
    // console.log('order dt' + orderdate.format());
    
    datediff=(datediff<4?datediff:3);

      if(this.cancelConditionValid(now,deliverydate,orderdate))
      // {
      //   console.log('can be cancelled');
      //   this.isOrderActionActive[index]=false;
      //   this.openSnackBarCancellationComplete('Order cancelled successfully.')
      // }
      {
        
        let obj:GenerallistDetails={Id:this.orderlist[index].orderid,Value:''};
        this.orderService.setOrderCancel(obj).subscribe(res=>{
          this.GetDataCount();
          this.loadData(0);
          this.requestinprocess=false;
          this.isOrderActionActive[index]=false;
          this.openSnackBarCancellationComplete('Order cancelled successfully.')

        },
        error=>{
          this.openSnackBar('Unable to process data');
          this.requestinprocess=false;
          this.isOrderActionActive[index]=false;
        })
      }
      else{
        this.openSnackBar('Order cancellation period for this order is over');
        this.requestinprocess=false;
        this.isOrderActionActive[index]=false;
      }

    },
    (err)=>{
      this.requestinprocess=false;
      this.isOrderActionActive[index]=false;
    })
    
  }

  cancelConditionValid(now:moment.Moment,deliverydate:moment.Moment,orderdate:moment.Moment)
  {
    let map=new Map([[1,1]]);
    let iscancellable:boolean=false;

    let newdt=orderdate.clone();
    newdt=newdt.startOf('day');
    // console.log('now '+now.format());
    // console.log('new now ',newdt.format());
    let datediff=deliverydate.diff(newdt,'days');

    // console.log('now ' +now.format());
    // console.log('delivery dt ' + deliverydate.format());
    // console.log('order dt ' + orderdate.format());
    // console.log('datediff '+datediff);

    if(datediff>0)
    {
      if(datediff==1)
      {
        let limithours=map.get(datediff);
        // console.log('hours diff =>'+ now.diff(orderdate,'hours'));
        if(now.diff(orderdate,'hours')<limithours)
        iscancellable=true;
      }
      else
      {
        let thresholddatetimeforcancellation=deliverydate.clone();
        thresholddatetimeforcancellation.subtract(1,'days').hours(16).minutes(0).seconds(0);
        now=now.add(330,'minutes');
        // console.log('/n------------------------------------------------/n')
        // console.log('delivery date is' +deliverydate.format());
        // console.log('threshold date is' +thresholddatetimeforcancellation.format());
        // console.log('now ' +now.format());

       iscancellable=(now.isAfter(thresholddatetimeforcancellation)?false:true);
      }
    }
    


    // console.log('iscancellable =>' +iscancellable)

    return iscancellable;
  }

  openSnackBar(msg:string) {
    // let msg=(this.itemCount>1?this.itemCount+' items':this.itemCount+' item');
    
    this._snackBar.open( msg, 'View Policy', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    this._snackBar._openedSnackBarRef.onAction().subscribe(
      ()=>{
        this.router.navigateByUrl('/cancellationpolicy');
      }
    )
  }

  openSnackBarCancellationComplete(msg:string)
  {
    this._snackBar.open( msg, 'Success', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

  }

  onPageFired(event){
  //  console.log(event.pageIndex);
    this.loadData(event.pageIndex);
  }

}
