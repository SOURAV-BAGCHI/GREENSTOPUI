import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Observable, fromEvent, of, timer, EMPTY } from 'rxjs';
import { Catagory } from '../models/catagory';
import { CatagoryDetailsService } from '../service/catagory-details.service';
import { AdditionalInfoDialogComponent } from '../dialog/additional-info-dialog/additional-info-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SubCatagory } from '../models/sub-catagory';
import { StorageService } from '../service/storage.service';
import { UiService } from '../service/ui.service';
import { WindowService } from '../service/window.service';
import { SearchService } from '../service/search.service';
import { map, debounceTime, distinctUntilChanged, pluck, switchMap, filter, debounce } from 'rxjs/operators';
import { FormControl, NgForm } from '@angular/forms';
import { ActivityService } from '../service/activity.service';
import { TooltipPosition } from '@angular/material/tooltip';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit,AfterViewInit {

  
  constructor(private catagoryDetailsService:CatagoryDetailsService,
    public dialog: MatDialog,
    private storage:StorageService,
    private win:WindowService,
    private _activity:ActivityService) { }

  private catagoryDetails$:Observable<Catagory[]>;
  catagoryDetails:Catagory[]=[];
  searchcatagoryDetails:Catagory[]=null;
  mainMenu:string[]=[];
  isSticky:boolean=false;
  winref:any=null;
  loadingData:boolean=false;
  // zerosearchResult:boolean=false;

  searchTermTemp:string='';
  
  element:Element;
  position:DOMRect;

  headerHeight:number;
  // @ViewChild('search') search:ElementRef;

  @ViewChild('searchForm') searchForm:NgForm;

  positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
  tooltipposition = new FormControl(this.positionOptions[0]);

  ngOnInit(): void {
    this.loadData();
  }

  scrollToTop()
  {
    this.win.scrollToTop();
  }

  loadData()
  {
    this.loadingData=true;
    this.catagoryDetails$=this.catagoryDetailsService.getCatagoryDetails();
    this.catagoryDetails$.subscribe(res=>{
      this.catagoryDetails=res;
      // console.log(res);
      
      this.searchList('');
      this.loadingData=false;
    },
    error=>{
      this.loadingData=false;
      this.catagoryDetails=[];
    })
  }

  ngAfterViewInit():void
  {
    this._activity.isnotloginPage$.next(true);
    this.winref=this.win.getWindowRef();
    // const searchTerm=fromEvent<any>(this.search.nativeElement,'keyup').pipe(
    //   map(event=>event.target.value),
    //   debounceTime(1000),
    //   distinctUntilChanged()
    // );
    // searchTerm.subscribe(res=>{
    //   console.log(res);

    //   this.searchList(res);

    //   console.log(this.searchcatagoryDetails);


    // });

    const formValue=this.searchForm.valueChanges;
    formValue.pipe(
      // map(data=>data.searchTerm),
      // map(data=>data['searchTerm']),
      // filter(()=>this.searchForm.valid),
      pluck('searchTerm'),
      debounceTime(500),
    //  debounce(data=>data.length>0?timer(2000):timer(200)),
      distinctUntilChanged(),
      switchMap(data=> this.searchList(data))
    )
    .subscribe(res=>{
    //  console.log(res);
    })
  }

  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    if(this.winref!=null)
    {
      this.element = document.querySelector('#header');
      this.position = this.element.getBoundingClientRect();
    
      if(this.position.top < this.winref.innerHeight && this.position.bottom >= 0) {
        
        this.isSticky=false;
      }
      else
      {
        if(this.winref.scrollY>this.winref.innerHeight/2)
        this.isSticky=true;
      }
    }
    
  }

  scroll(elementCls:string,scrollup:boolean=true):void
  {
  //  console.log(elementCls);
    let el=document.getElementsByClassName(elementCls);
    el[0].scrollIntoView({behavior:"smooth"});

    // if(scrollup && elementCls=='1_')
    
    if(this.searchcatagoryDetails!=null && this.searchcatagoryDetails.length>0)
    {
      if(elementCls==this.searchcatagoryDetails[0].id+'_')// '1_')
      {
        setTimeout(() => {
          this.winref.scrollBy(0,-60);
        }, 1000);
      }
    }
    
    // console.log(elementCls);

  }

  addToCart(item:SubCatagory,note:string="")
  {
    this.storage.setItem(item,note);
    item.quantity=0;
  }

  openDialog(item:SubCatagory) {
    const dialogRef = this.dialog.open(AdditionalInfoDialogComponent, {
      // width: '300px',
      data: {id: item.id, name: item.name,name2:item.name2,detail:item.detail,type:item.type,description:item.description,price:item.price,quantity:0,image:null},
      hasBackdrop:false
    });

    dialogRef.afterClosed().subscribe(result=>{
      // console.log('done');
    })
  }

  searchList(searchTerm:string):Observable<any>
  {
      this.searchTermTemp=searchTerm;
      if(searchTerm!=null)
      {
        searchTerm=searchTerm.toLowerCase();
      
        this.searchcatagoryDetails=[];
        this.catagoryDetails.forEach(element => {
          let tempCatagoryDetails:Catagory={id:element.id,image:element.image,name:element.name,subcatagoryList:[]};
          element.subcatagoryList.forEach(item => {
            if((item.name.toLowerCase().indexOf(searchTerm)>-1) || (item.description.toLowerCase().indexOf(searchTerm)>-1))
            {
              tempCatagoryDetails.subcatagoryList.push(item);
            }
          });
          
          if(tempCatagoryDetails !=null && tempCatagoryDetails.subcatagoryList.length>0)
          {
            this.searchcatagoryDetails.push(tempCatagoryDetails);
          }
  
        });

        if(!this.isSticky && this.catagoryDetails.length==this.searchcatagoryDetails.length)
        {

        }
        else
        {
          if(this.searchcatagoryDetails.length>0)
          this.scroll('menu_start',false);
        }
        
      }


      return of(this.searchcatagoryDetails);
  }

}
