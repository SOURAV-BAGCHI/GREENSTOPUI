import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { Observable } from 'rxjs';
import { OrderDetails } from '../models/order-details';
import { OrderDetailsSmall } from '../models/order-details-small';
import { GenerallistDetails } from '../models/generallist-details';
import { map, tap } from 'rxjs/operators';
import { tick } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
}) 
export class OrderService {

  constructor(private http:HttpClient) { }
  private hostAddress:string=config.hostname;
  private baseUrlCreateOrder:string=this.hostAddress+'api/Order/Create';
  private baseUrlGetOrderDetailsMin:string=this.hostAddress+'api/Order/GetOrderDetailsMin';
  private baseUrlSetOrderCancel:string=this.hostAddress+'api/Order/SetOrderCancel'
  private baseUrlGetCurrentOrderDetails:string=this.hostAddress+'api/Order/GetCurrentOrderDetails';
  private baseUrlGetCurrentOrderDetailsCount:string=this.hostAddress+'api/order/GetCurrentOrderDetailsCount';
  private baseUrlGetOrderDetailsHistory:string=this.hostAddress+'api/Order/GetOrderDetailsHistory';
  private baseUrlGetOrderDetailsHistoryCount:string=this.hostAddress+'api/Order/GetOrderDetailsHistoryCount';
  private baseUrlGetOrderDeliveryDetails:string=this.hostAddress+'api/Order/GetOrderDeliveryDetails';
  private baseUrlGetCustomerInfo:string=this.hostAddress+'api/Order/GetCustomerInfo';
  private baseUrlGetOrderDetailsMinCount:string=this.hostAddress+'api/Order/GetOrderDetailsMinCount';
  private baseUrlGetOrderDetails:string=this.hostAddress+'api/Order/GetOrderDetails';
  // private baseUrlGetOrderDocument:string=this.hostAddress+'api/Order/GetOrderDocument';

  private CreateOrder$:Observable<any>;

  private deliveryTimeIdValue=config.deliveryTimeIdValue;

  createOrder(orderDetails:OrderDetails):Observable<any>
  {
  //  console.log(orderDetails);
    return this.CreateOrder$=this.http.post<any>(this.baseUrlCreateOrder,orderDetails);
    //return this.CreateOrder$;
  }

  getOrderDetailsMin(pageno:number):Observable<OrderDetailsSmall[]>
  {
    return this.http.get<OrderDetailsSmall[]>(this.baseUrlGetOrderDetailsMin+'/'+pageno);
  }

  getOrderDetailsMinCount():Observable<any>
  {
    return this.http.get<any>(this.baseUrlGetOrderDetailsMinCount);
  }

  setOrderCancel(Obj:GenerallistDetails):Observable<any>
  {
    return this.http.put<any>(this.baseUrlSetOrderCancel,Obj);
  }

  getCurrentOrderDetails(date:string,deliverytimeid:number,pageno:number):Observable<any>
  {
    return this.http.get<any>(this.baseUrlGetCurrentOrderDetails+'/'+date+'/'+deliverytimeid+'/'+pageno)
    .pipe(
      map(res=>{
        let orderList:any[]=[];
        let index:number=1;
        res.result.forEach(element => {
          orderList.push({position:index++,OrderId:element.orderId,UserId:element.userId,CustomerInfo:JSON.parse(element.customerInfo),
            ItemDetails:JSON.parse(element.itemDetails),CreateDate:element.createDate,OrderStatus:element.orderStatus,
            PaymentStatus:element.paymentStatus,DeliveryDate:element.deliveryDate,DeliveryTime:this.deliveryTimeIdValue.get(element.deliveryTimeId),
            PaymentInfo:JSON.parse(element.paymentInfo),SubTotal:element.subTotal,Tax:element.tax,
            DeliveryCharges:element.deliveryCharges,CustomerServiceStatus:element.customerServiceStatus,OrderStatusLog:element.orderStatusLog});
        });
        return orderList;
      })
      // ,
      // tap(res=> console.log(res))
      
    )
    ;
  }

  GetCurrentOrderDetailsCount(date:string,deliverytimeid:number):Observable<any>
  {
    return this.http.get<any>(this.baseUrlGetCurrentOrderDetailsCount+'/'+date+'/'+deliverytimeid);
  }

  getOrderDetailsHistory(date:string,deliverytimeid:number,pageno:number):Observable<any>
  {
    return this.http.get<any>(this.baseUrlGetOrderDetailsHistory+'/'+date+'/'+deliverytimeid+'/'+pageno)
    .pipe(
      map(res=>{
        let orderList:any[]=[];
        let index:number=1;
        res.result.forEach(element => {
          orderList.push({position:index++,OrderId:element.orderId,UserId:element.userId,CustomerInfo:JSON.parse(element.customerInfo),
            ItemDetails:JSON.parse(element.itemDetails),CreateDate:element.createDate,OrderStatus:element.orderStatus,
            PaymentStatus:element.paymentStatus,DeliveryDate:element.deliveryDate,DeliveryTime:this.deliveryTimeIdValue.get(element.deliveryTimeId),
            PaymentInfo:JSON.parse(element.paymentInfo),SubTotal:element.subTotal,Tax:element.tax,
            DeliveryCharges:element.deliveryCharges,CustomerServiceStatus:element.customerServiceStatus,OrderStatusLog:element.orderStatusLog});
        });
        return orderList;
      })
    )
    ;
  }

  getOrderDetailsHistoryCount(date:string,deliverytimeid:number):Observable<any>
  {
    return this.http.get<any>(this.baseUrlGetOrderDetailsHistoryCount+'/'+date+'/'+deliverytimeid);
  }

  getOrderDeliveryDetails(date:string):Observable<OrderDetails[]>
  {
    return this.http.get<OrderDetails[]>(this.baseUrlGetOrderDeliveryDetails+'/'+date);
  }

  getCustomerInfo():Observable<string>
  {
    return this.http.get<string>(this.baseUrlGetCustomerInfo);
  }

  getOrderDetails(orderId:string):Observable<any>
  {
    return this.http.get<any>(this.baseUrlGetOrderDetails+'/'+orderId)
    .pipe(
      map(res=>{
        let orderList:any[]=[];
        let index:number=1;
        res.result.forEach(element => {
          orderList.push({position:index++,OrderId:element.orderId,UserId:element.userId,CustomerInfo:JSON.parse(element.customerInfo),
            ItemDetails:JSON.parse(element.itemDetails),CreateDate:element.createDate,OrderStatus:element.orderStatus,
            PaymentStatus:element.paymentStatus,DeliveryDate:element.deliveryDate,DeliveryTime:this.deliveryTimeIdValue.get(element.deliveryTimeId),
            PaymentInfo:JSON.parse(element.paymentInfo),SubTotal:element.subTotal,Tax:element.tax,
            DeliveryCharges:element.deliveryCharges,CustomerServiceStatus:element.customerServiceStatus});
        });
        return orderList;
      })
    )
  }


}
