import { Injectable, ElementRef, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { map, debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService implements AfterViewInit {

  constructor() { }

  // @ViewChild('search') search:ElementRef;
  public search:ElementRef;
  ngAfterViewInit():void
  {
      const searchTerm=fromEvent<any>(this.search.nativeElement,'keyup').pipe(
        map(event=>event.target.value),
        debounceTime(1000),
        distinctUntilChanged()
      );
      searchTerm.subscribe(res=>{
        console.log(res);
      });
  }
  



}
