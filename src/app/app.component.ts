import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {SwPush, SwUpdate} from '@angular/service-worker';
import { filter } from 'rxjs/operators';

declare var gtag;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Greenstop';

  /**
   *
   */
  constructor(updates:SwUpdate,
    private swPush: SwPush,
    router:Router) {
      const navEndEvents= router.events.pipe(
        filter(events=> events instanceof NavigationEnd)
      );

      navEndEvents.subscribe((events:NavigationEnd)=>{
        gtag('config', 'G-T7F8HND7F5',{
          'page_path':events.urlAfterRedirects
        });
      })

      updates.available.subscribe(event=>{
        updates.activateUpdate().then(()=> document.location.reload());
      })

      this.swPush.notificationClicks.subscribe( event => {
        console.log('Received notification: ', event);
        const url = event.notification.data.url;
        window.open(url, '_self');
      });
    
  }
}
