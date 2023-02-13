import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { config } from 'src/app/config';

@Component({
  selector: 'app-startup-dialog',
  templateUrl: './startup-dialog.component.html',
  styleUrls: ['./startup-dialog.component.css']
})
export class StartupDialogComponent implements OnInit {

  constructor(public dialogRef:MatDialogRef<StartupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:string,
    private router:Router) { }

    globalsite=config.globalsite;
    helppage=this.globalsite+'/help';
  ngOnInit(): void {
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  gotohelp()
  {
    this.onNoClick();
    this.router.navigate(['/help']);
  }
}
