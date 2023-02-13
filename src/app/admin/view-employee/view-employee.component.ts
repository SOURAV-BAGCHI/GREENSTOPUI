import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/service/admin.service';
import { PeriodicElement } from '../current-order/current-order.component';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.css']
})
export class ViewEmployeeComponent implements OnInit {

  constructor(private adminService:AdminService) { }

  columnsToDisplay = ['Name','Id', 'Phone', 'Role'];
  expandedElement: PeriodicElement | null;

  roleid:string='none';
  isLoadingResults:boolean=false;
  dataSource:any;

  pageCount:Number=0;
  pageOffsetCount:number=1; 
  currentPage:number=1;
  pageSize:number=10;
  currentpageIndex:number=0; 

  ngOnInit(): void {
    this.GetDataCount();
    this.loadData(0);
  }

  GetDataCount()
  {
    this.adminService.GetEmployeeCount(this.roleid).subscribe(res=>{
      this.pageCount=res.count;
     console.log(res);
    });
  }

  loadData(pagenumber:number):void{
    this.isLoadingResults=true;
    
    this.adminService.GetEmployyDetails(this.roleid,pagenumber).subscribe(res=>{
      
      this.dataSource=res;
      //console.log(this.dataSource);
      this.currentpageIndex=pagenumber;
      this.isLoadingResults=false;
    },
    error=>{
      this.isLoadingResults=false;
    })
  }

  onPageFired(event){
    //  console.log(event.pageIndex);
      this.loadData(event.pageIndex);
    }

}
