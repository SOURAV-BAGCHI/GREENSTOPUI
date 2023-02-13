import { ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor() { }

  iscartOpened$=new BehaviorSubject<boolean>(false);
  isnotloginPage$=new BehaviorSubject<boolean>(true);
  openCapcha$=new BehaviorSubject<boolean>(false);

  orderSuccessful$=new BehaviorSubject<boolean>(false);

  private adminSection$=new BehaviorSubject<boolean>(false);

  private activityStateChange$=new BehaviorSubject<boolean>(false);

  get isnotloginPage()
  {
    return this.isnotloginPage$.asObservable();
  }

  get orderSuccessful()
  {
    return this.orderSuccessful$.asObservable();
  }

  get isAdminSection()
  {
    return this.adminSection$.asObservable();
  }

  set adminSection(value:boolean)
  {
    this.adminSection$.next(value);
  }

  get isactivityStateChange()
  {
    return this.activityStateChange$.asObservable();
  }

  set activityStateChange(value:boolean)
  {
    this.activityStateChange$.next(value);
  }

}
