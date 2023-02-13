import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AccountService } from 'src/app/service/account.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sidenav-dialog',
  templateUrl: './sidenav-dialog.component.html',
  styleUrls: ['./sidenav-dialog.component.css']
})
export class SidenavDialogComponent implements OnInit {

  constructor(
    public dialogRef:MatDialogRef<SidenavDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:string,
    private acct:AccountService
  ) { }

  loginStatus$ :Observable<boolean>;
  displayName$:Observable<string>;
  userName$:Observable<string>;
  loginStatus:Boolean=false;

  ngOnInit(): void {
    // this.loginStatus$=this.acct.isLoggedIn;
    // this.acct.isLoggedIn.subscribe(result=>{
    //   //console.log(result);
    //   this.loginStatus=result;
    //   console.log(result);
    // })
    this.displayName$=this.acct.displayUserName;
    this.userName$=this.acct.currentUserName;
  }
  onNoClick(): void {
    // console.log('It is hitting')
    this.dialogRef.close();
  }

}
