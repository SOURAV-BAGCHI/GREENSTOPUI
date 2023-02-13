import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../config';
import { FeedbackClientViewModel } from '../models/feedback-client-view-model';
import { FeedbackViewModel } from '../models/feedback-view-model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private http:HttpClient) {
    
  }
  private hostAddress:string=config.hostname;
  private baseUrlSetFeedback:string=this.hostAddress+'api/Feedback/SetFeedback';
  private baseUrlGetFeedbackCount:string=this.hostAddress+'api/Feedback/GetFeedbackCount';
  private baseUrlGetFeedbacks:string=this.hostAddress+'api/Feedback/GetFeedbacks/';
  
  setFeedback(data:FeedbackViewModel):Observable<any>
  {
    return this.http.post<any>(this.baseUrlSetFeedback,data);
  }

  getFeedbackCount():Observable<any>
  {
    return this.http.get<any>(this.baseUrlGetFeedbackCount);
  }

  getFeedbacks(pageno:number):Observable<FeedbackClientViewModel[]>
  {
    return this.http.get<FeedbackClientViewModel[]>(this.baseUrlGetFeedbacks+pageno);
  }

} 
