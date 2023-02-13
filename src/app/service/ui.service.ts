import { Injectable } from '@angular/core';
import { WindowService } from './window.service';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private header:HTMLElement;
  private sticky:number;
  constructor(private win:WindowService) { 
    

    // this.win.onscroll=function(){this.stickyheader()}
    
  }

  
  public headerScrollObserver():void
  {
    this.header = document.getElementById("myHeader");
    this.sticky = this.header.offsetTop;
   
    this.win.getWindowRef().onscroll = function() {()=>{
      console.log(this.sticky);
      if (this.win.getWindowRef().pageYOffset > this.sticky) {
        this.header.classList.add("sticky");
      } else {
        this.header.classList.remove("sticky");
      }
    }
    };
  }

  private stickyheader():void {
    if (this.win.getWindowRef().pageYOffset > this.sticky) {
      this.header.classList.add("sticky");
    } else {
      this.header.classList.remove("sticky");
    }
  }
}
