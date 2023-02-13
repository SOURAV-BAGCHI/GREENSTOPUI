import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { OrderService } from 'src/app/service/order.service';

@Component({
  selector: 'app-order-details-dialog',
  templateUrl: './order-details-dialog.component.html',
  styleUrls: ['./order-details-dialog.component.css']
})
export class OrderDetailsDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OrderDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private orderService:OrderService) { }

    orderDetails:any=null;
    isLoadingData:boolean=false;
    itemTotal:number=0; 
 
  ngOnInit(): void {
    // this.loadData(this.data);
    // console.log(this.data);
    if(this.data)
    {
      this.data.ItemDetails.forEach(item => {
        this.itemTotal+=item.price*item.quantity;
      });
    }
    // console.log(this.data.PaymentInfo.Mode);
  }

  loadData(orderId:string)
  {
    this.isLoadingData=true;
    this.orderService.getOrderDetails(orderId)
    .pipe(
      tap(x=> this.isLoadingData=false)
    )
    .subscribe(res=>{
      this.orderDetails=res;
      console.log(this.orderDetails);
    })
  }

}
