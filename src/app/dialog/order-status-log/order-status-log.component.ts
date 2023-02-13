import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-status-log',
  templateUrl: './order-status-log.component.html',
  styleUrls: ['./order-status-log.component.css']
})
export class OrderStatusLogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<OrderStatusLogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  orderId:string;
  orderStatusLog:any;
  statusMap=new Map();

  ngOnInit(): void {
    this.orderId=this.data.OrderId;
    this.orderStatusLog=JSON.parse(this.data.OrderStatusLog);
    console.log(this.orderStatusLog);
    this.loadStatusMap();
  }

  loadStatusMap()
  {
    this.statusMap.set(1,'Order placed :');
    this.statusMap.set(2,'Order approved:');
    this.statusMap.set(3,'Order assigned to kitchen:');
    this.statusMap.set(4,'Order assigned to delivery:');
    this.statusMap.set(5,'Order preparation complete by kitchen:');
    this.statusMap.set(6,'Pickup done by delivery:');
    this.statusMap.set(8,'Order completed:');
    this.statusMap.set(9,'Order cancelled');
  }
}
