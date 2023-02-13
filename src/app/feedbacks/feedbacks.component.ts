import { Component, OnInit } from '@angular/core';
import { FeedbackClientViewModel } from '../models/feedback-client-view-model';
import { FeedbackService } from '../service/feedback.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css']
})
export class FeedbacksComponent implements OnInit {

  constructor(private feedback_service:FeedbackService) { }

  feedbackList:FeedbackClientViewModel[]=[];
  isLoadingData:boolean;

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
    this.feedback_service.getFeedbackCount().subscribe(res=>{
      this.pageCount=res.count;
      // console.log(res);
    });
  }

  loadData(pagenumber:number):void{
    this.isLoadingData=true;
    
    this.feedback_service.getFeedbacks(pagenumber).subscribe(res=>{
      
      this.feedbackList=res;
      //console.log(this.dataSource);
      this.currentpageIndex=pagenumber;
      this.isLoadingData=false;
    },
    error=>{
      this.isLoadingData=false;
    })
  }

  onPageFired(event){
    //  console.log(event.pageIndex);
      this.loadData(event.pageIndex);
    }

}
