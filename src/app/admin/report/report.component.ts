import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { ReportService } from 'src/app/service/report.service';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  constructor(private reportService:ReportService,
    private fb:FormBuilder,
    private snackbar:SnackbarService) { }

  getTimeSlotWiseItemsToCookFG:FormGroup;
  getTimeSlotWiseItemsToDeliverFG:FormGroup;

  getTimeSlotWiseItemsToCookIsLoading:boolean=false;
  getTimeSlotWiseItemsToDeliverIsLoading:boolean=false;

  getTimeSlotWiseItemsToCookdownloadLink:string;//="http://localhost:5000/api/Report/GetTime_slot_wise_items_to_cook/04-04-2021";
  getTimeSlotWiseItemsToDeliverdownloadLink:string;

  ngOnInit(): void {
    this.getTimeSlotWiseItemsToCookFG=this.fb.group({
      dateCtrl:['',Validators.required]
    });

    this.getTimeSlotWiseItemsToCookFG.controls.dateCtrl.valueChanges.subscribe(res=>{
      this.getTimeSlotWiseItemsToCookdownloadLink=this.reportService.baseUrlGetTime_slot_wise_items_to_cook+'/'+res.format("DD-MM-yyyy");
    })

    this.getTimeSlotWiseItemsToDeliverFG=this.fb.group({
      dateCtrl:['',Validators.required]
    });

    this.getTimeSlotWiseItemsToDeliverFG.controls.dateCtrl.valueChanges.subscribe(res=>{
      this.getTimeSlotWiseItemsToDeliverdownloadLink=this.reportService.baseUrlGetTime_slot_wise_items_to_deliver+'/'+res.format("DD-MM-yyyy");
    })
  }

  // getTimeSlotWiseItemsToCook()
  // {
    
  //   let dt=this.getTimeSlotWiseItemsToCookFG.controls.dateCtrl.value.format("DD-MM-yyyy");
    
  //   this.getTimeSlotWiseItemsToCookIsLoading=true;

  //   this.reportService.getTimeSlotWiseItemsToCook(dt)
  //   .pipe(
  //     tap(r=>this.getTimeSlotWiseItemsToCookIsLoading=false)
  //   )
  //   .subscribe(res=>{
  //     this.snackbar.openSnackBar("File downloaded successfully","");
  //   },
  //   error=>{
  //     console.error(error);
  //     this.snackbar.openSnackBar("Something went wrong","Error");
  //   });
  // }

  // getTimeSlotWiseItemsToDeliver()
  // {
  //   let dt=this.getTimeSlotWiseItemsToDeliverFG.controls.dateCtrl.value.format("DD-MM-yyyy");
  //   this.getTimeSlotWiseItemsToDeliverIsLoading=true;
  //   this.reportService.getTimeSlotWiseItemsToDeliver(dt)
  //   .pipe(
  //     tap(r=>this.getTimeSlotWiseItemsToDeliverIsLoading=false)
  //   )
  //   .subscribe(res=>{
  //     this.snackbar.openSnackBar("File downloaded successfully","");
  //   },
  //   error=>{
  //     console.error(error);
  //     this.snackbar.openSnackBar("Something went wrong","Error");
  //   });
  // }

}
