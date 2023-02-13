import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { FeedbackViewModel } from '../models/feedback-view-model';
import { FeedbackService } from '../service/feedback.service';

@Component({
  selector: 'app-feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.css']
})
export class FeedbackFormComponent implements OnInit {

  constructor(private _activatedRoute:ActivatedRoute,
    private router:Router,
    private feedback_service:FeedbackService) { }

  orderid:string;
  isCodeValid:Boolean;
  message:String;
  
  isRequestInProcess=false;
  // reasonforCancellation:string;
  reviewTitle:string;
  rating:number = 3;
  starCount:number = 5;

  reviewTitleFormControl=new FormControl('',[
    Validators.required,
    Validators.maxLength(50)
  ]);

  reviewFormControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(500),
  ]);
  
  // private isFeedbackSuccess$:Observable<Number>;

  ngOnInit(): void {
    this.orderid=this._activatedRoute.snapshot.params['orderid'] || '';
  }

  gotohome()
  {
    this.router.navigateByUrl("/home"); 
  }

  onRatingChanged(rating){
    
    this.rating = rating;
  }

  onSubmit()
  {
    //console.log('Rating =>'+this.rating+' Review Title =>'+this.reviewTitleFormControl.value+' Review =>'+this.reviewFormControl.value);
    this.isRequestInProcess=true;
  
      if(this.orderid==null || this.orderid.length==0)
      {
        this.isRequestInProcess=false;
        this.isCodeValid=false;
        this.message='Invalid code. Please check your link and try again. For any inconvinience please contact us.'
      }
      else
      {
        let feedbackviewmodel:FeedbackViewModel={
          OrderId:this.orderid,
          Rating:this.rating,
          ReviewTitle:this.reviewTitleFormControl.value,
          Review:this.reviewFormControl.value
        };

        this.feedback_service.setFeedback(feedbackviewmodel)
        .pipe(
          tap(res=>{
            this.isRequestInProcess=false;
          })
        ).subscribe(res=>{
          if(res==1)
          {
            this.isCodeValid=true;
            this.message="Thank you for your valueable feedback";
          }
          else
          {
            this.isCodeValid=false;
            this.message="Feedback already present";
          }

          
        },
        error=>{
          this.isCodeValid=false;
          this.message="Unable to register feedback for this Order.Try again later";
          console.log(error);
        });
      }

  }

}
