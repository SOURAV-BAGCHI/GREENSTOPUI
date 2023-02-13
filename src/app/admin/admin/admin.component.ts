import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogPosition } from '@angular/material/dialog';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { NgDialogAnimationService } from 'ng-dialog-animation';
import { Observable } from 'rxjs';
import { AdminSidenavDialogComponent } from 'src/app/dialog/admin-sidenav-dialog/admin-sidenav-dialog.component';
import { AccountService } from 'src/app/service/account.service';
import { ActivityService } from 'src/app/service/activity.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit,OnDestroy {

  constructor(private activity:ActivityService,
    public dialog: NgDialogAnimationService,
    private acct:AccountService) { }

  // horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  // verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  currentUserRole$:Observable<string>;
  ngOnInit(): void {
    this.activity.adminSection=true;
    this.currentUserRole$=this.acct.currentUserRole;
  }

  ngOnDestroy():void{
    this.activity.adminSection=false;
  }
  openSidenav()
  {
    const dialogPosition: DialogPosition = {
      top: '0px',
      left: '0px'
      // right:'0px'
    };
  
    let width:number= window.innerWidth;
    let widthcss:string='30vw';
    if(width<600)
    {
      widthcss='70vw'
    }
    else if(width<900)
    {
      widthcss='40vw';
    }
    const dialogRef = this.dialog.open(AdminSidenavDialogComponent, {
      width: widthcss,
      // position: dialogPosition,
      position: { rowEnd: "0" },
      data: "item",//{name: this.name, phone: this.phone,email:this.email,type:'user'}
      hasBackdrop:true,
      animation: { to: "right" },
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe(result=>{
      // console.log('done');
    })
  }
}
