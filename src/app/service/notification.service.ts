import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private http:HttpClient) { }

  private hostAddress:string=config.subscribe_hostname;
  private baseUrlgetPublicKey:string=this.hostAddress+'api/PublicKey';
  private baseUrlPushSubscriptions:string=this.hostAddress+'api/PushSubscriptions';
  private baseUrlDeleteSubscriptions:string=this.hostAddress+'api/PushSubscriptions';

  getPublicKey():Observable<any>
  {
    return this.http.get<any>(this.baseUrlgetPublicKey);
  }

  pushSubscriptionPost(subscription :PushSubscription):Observable<any>
  {
    return this.http.post(this.baseUrlPushSubscriptions, 
      // {endpoint:subscription.endpoint,
      // p256dh:subscription.getKey('p256dh'),
      // auth:subscription.getKey('auth')}
        subscription.toJSON()
      );
  }

  deleteSubscription(endpoint:string):Observable<any>
  {
    return this.http.delete(this.baseUrlDeleteSubscriptions+"/"+encodeURIComponent(endpoint));
  }
  
}
