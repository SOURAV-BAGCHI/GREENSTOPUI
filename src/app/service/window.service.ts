import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor() { }
  getWindowRef()
  {
    return window;
  }

  scrollToTop()
  {
    window.scrollTo(0,0);
  }
}
