import { Component, OnInit } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { tap } from 'rxjs/operators';
import { NotificationService } from '../service/notification.service';

@Component({
  selector: 'app-subscribe-test',
  templateUrl: './subscribe-test.component.html',
  styleUrls: ['./subscribe-test.component.css']
})
export class SubscribeTestComponent implements OnInit {

  private _subscription: PushSubscription; 
  public operationName: string;

  constructor(private swPush: SwPush,
  private notificatonService:NotificationService) {

    console.log('Entering constructor')
    swPush.subscription.subscribe((subscription) => {
      this._subscription = subscription;
      console.log('Entering swPUsh')
      this.operationName = (this._subscription === null) ? 'Subscribe' : 'Unsubscribe';
      console.log(this.operationName);
    });

   }
  
  isEnabled = this.swPush.isEnabled;
  isGranted = Notification.permission === 'granted';


  ngOnInit(): void {
  }

  operation() {
    (this._subscription === null) ? this.subscribe() : this.unsubscribe(this._subscription.endpoint);
   };

  private subscribe() {
    this.notificatonService.getPublicKey().subscribe(publicKey=>{
      // Request subscription with the service worker
      console.log(publicKey);
      this.swPush.requestSubscription({
        serverPublicKey: publicKey.publicKey
      })
      .then(subscription =>
        this.notificatonService.pushSubscriptionPost(subscription)
        .pipe(
          tap(res=>console.log(subscription))
        )
        .subscribe(
          () => { },
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
    this.swPush.unsubscribe()
    .then(()=>this.notificatonService.deleteSubscription(endpoint).subscribe(()=>{},
      error=>console.error(error)
    ))
    .catch(error => console.error(error));
  }

}
