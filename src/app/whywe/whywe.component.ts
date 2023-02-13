import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-whywe',
  templateUrl: './whywe.component.html',
  styleUrls: ['./whywe.component.css']
})
export class WhyweComponent implements OnInit,AfterViewInit {

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit():void{
    setTimeout(() => {
      this.scrollToClass('moveto');
    }, 500);
    
  }

  scrollToClass(elementCls:string):void
  {
  //  console.log(elementCls);
    let el=document.getElementsByClassName(elementCls);
  //  console.log(el);
    if(el.length>0){
      el[0].scrollIntoView({behavior:"smooth"});
    }
    else
    {
      console.log(elementCls +' is not found');
    }
    
  }

}
