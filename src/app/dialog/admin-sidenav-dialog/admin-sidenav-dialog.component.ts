import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/service/account.service';

@Component({
  selector: 'app-admin-sidenav-dialog',
  templateUrl: './admin-sidenav-dialog.component.html',
  styleUrls: ['./admin-sidenav-dialog.component.css']
})
export class AdminSidenavDialogComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<AdminSidenavDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:string,
    private acct:AccountService) { }

  currentUserRole$:Observable<string>;

  ngOnInit(): void {
    this.currentUserRole$=this.acct.currentUserRole;
  }

  onNoClick(): void {
    // console.log('It is hitting')
    this.dialogRef.close();
  }

}
