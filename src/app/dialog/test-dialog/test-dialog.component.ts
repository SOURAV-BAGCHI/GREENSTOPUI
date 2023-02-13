import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-test-dialog',
  templateUrl: './test-dialog.component.html',
  styleUrls: ['./test-dialog.component.css']
})
export class TestDialogComponent implements OnInit {

  constructor(
    public dialogRef:MatDialogRef<TestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:string
  ) { }

  ngOnInit(): void {
  }
  onNoClick(): void {
    // console.log('It is hitting')
    this.dialogRef.close();
  }
}
