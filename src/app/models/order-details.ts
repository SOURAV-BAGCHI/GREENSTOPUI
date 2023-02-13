export interface OrderDetails {

    OrderId:string;
    UserId:string;
    CustomerInfo:string;
    ItemDetails:string;
    CreateDate:string;//Date;
    OrderStatus:number;
    OrderStatusLog:string;
    PaymentStatus:boolean;
    DeliveryDate:string;//Date;
    DeliveryTimeId:number;
    PaymentInfo:string;
    SubTotal:number;
    Tax:number;
    DeliveryCharges:number;
    CustomerServiceStatus:string;
}

