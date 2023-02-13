import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { PaymentInfoDetails } from '../models/payment-info-details';
import { EmployeeDetails } from '../models/employee-details';

@Injectable({
  providedIn: 'root' 
})
export class AdminService {

  constructor(private http:HttpClient) { }
  private hostAddress:string=config.hostname;
  private baseUrlSetCustomerServiceStatus:string=this.hostAddress+'api/Admin/SetCustomerServiceStatus';
  private baseUrlSetOrderAction:string=this.hostAddress+'api/Admin/SetOrderAction';
  private baseUrlGetEmployeeByRole:string=this.hostAddress+'api/General/GetEmployeeByRole';
  private baseUrlCheckOtp:string=this.hostAddress+'api/Admin/CheckOtp';
  private baseUrlUpdatePaymentInfo:string=this.hostAddress+'api/Admin/UpdatePaymentInfo';
  private baseUrlGetEmployeeCount:string=this.hostAddress+'api/Admin/GetEmployeeCount';
  private baseUrlGetEmployyDetails:string=this.hostAddress+'api/Admin/GetEmployyDetails';

  public SetCustomerServiceStatus(orderid:string,customerservicestatus:string):Observable<any>
  {
    return this.http.put<any>(this.baseUrlSetCustomerServiceStatus,{OrderId:orderid,Value:customerservicestatus});
  }

  public SetOrderAction(orderid:string,useridto:string,status:number):Observable<any>
  {
    return this.http.put<any>(this.baseUrlSetOrderAction,{orderid:orderid,useridto:useridto,status:status});
  }

  public GetEmployeeByRole(roleid:string,lastrecord:number)
  {
    return this.http.get<any>(this.baseUrlGetEmployeeByRole+'/'+roleid+'/'+lastrecord).pipe(shareReplay());
  }

  public CheckOtp(orderid:string,code:string):Observable<boolean>
  {
    return this.http.get<boolean>(this.baseUrlCheckOtp+'/'+orderid+'/'+code);
  }

  public UpdatePaymentInfo(paymentinfo:PaymentInfoDetails):Observable<any>
  {
    return this.http.put<any>(this.baseUrlUpdatePaymentInfo,paymentinfo) ;
  }

  public GetEmployeeCount(roleid:string):Observable<any>
  {
    return this.http.get<any>(this.baseUrlGetEmployeeCount+'/'+roleid);
  }

  public GetEmployyDetails(roleid:string,pageno:number):Observable<EmployeeDetails[]>
  {
    return this.http.get<EmployeeDetails[]>(this.baseUrlGetEmployyDetails+'/'+roleid+'/'+pageno);
  }




}
