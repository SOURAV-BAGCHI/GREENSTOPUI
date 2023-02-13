import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private http:HttpClient) { }

  private hostAddress:string=config.hostname;
  public baseUrlGetTime_slot_wise_items_to_cook:string=this.hostAddress+'api/Report/GetTime_slot_wise_items_to_cook';
  public baseUrlGetTime_slot_wise_items_to_deliver:string=this.hostAddress+'api/Report/GetTime_slot_wise_items_to_deliver';

  getTimeSlotWiseItemsToCook(date:string)
  {
    return this.http.get<Blob>(this.baseUrlGetTime_slot_wise_items_to_cook+'/'+date);
  }

  getTimeSlotWiseItemsToDeliver(date:string):Observable<any>
  {
    return this.http.get<any>(this.baseUrlGetTime_slot_wise_items_to_deliver+'/'+date);
  }


}
