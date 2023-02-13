import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdminService } from 'src/app/service/admin.service';

@Component({
  selector: 'app-role-employee-dialog',
  templateUrl: './role-employee-dialog.component.html',
  styleUrls: ['./role-employee-dialog.component.css']
})
export class RoleEmployeeDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<RoleEmployeeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: number,
    private adminService:AdminService) { }

  private order_status_role_map=new Map([[3,"5"],[4,"6"]])
  role_employee_details = [];
  role_id:string;
  //   {value: '1', viewValue: '11 am - 12 pm'},
  //   {value: '2', viewValue: '12 pm - 1 pm'},
  //   {value: '3', viewValue: '1 pm - 2 pm'},
  //   {value: '4', viewValue: '2 pm - 3 pm'},
  //   {value: '5', viewValue: '3 pm - 4 pm'},
  //   {value: '6', viewValue: '4 pm - 5 pm'},
  //   {value: '7', viewValue: '5 pm - 6 pm'},
  //   {value: '8', viewValue: '6 pm - 7 pm'},
  //   {value: '9', viewValue: '7 pm - 8 pm'},
  //   {value: '10', viewValue: '8 pm - 9 pm'}
  // ];

  ngOnInit(): void {
    console.log(this.data+' it is the order assigned');
    this.adminService.GetEmployeeByRole(this.order_status_role_map.get(this.data),0).subscribe(res=>{
      console.log(res);
      res.record.forEach(element => {
        
        this.role_employee_details.push({value:element.id,viewValue:element.value});
      });
    },
    error=>{

    });
  }

  onNoClick(): void {
    this.dialogRef.close(this.role_id);
  }

}
