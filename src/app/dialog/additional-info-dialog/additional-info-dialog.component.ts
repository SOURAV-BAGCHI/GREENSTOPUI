import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubCatagory } from 'src/app/models/sub-catagory';
import { StorageService } from 'src/app/service/storage.service';
import { ThemePalette } from '@angular/material/core';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

@Component({
  selector: 'app-additional-info-dialog',
  templateUrl: './additional-info-dialog.component.html',
  styleUrls: ['./additional-info-dialog.component.css']
})
export class AdditionalInfoDialogComponent implements OnInit {

  constructor(
    public dialogRef:MatDialogRef<AdditionalInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data:SubCatagory,
    private storage:StorageService
  ) { }
  public noteForTheCook:string;

  task: Task = {
    name: 'Indeterminate',
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'No salt', completed: false, color: 'primary'},
      {name: 'No sugar', completed: false, color: 'primary'},
      {name: 'No chili', completed: false, color: 'primary'}
    ]
  };

  updateAllComplete() {
    // this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    this.noteForTheCook='';
    this.task.subtasks.forEach(element => {
      if(element.completed)
      this.noteForTheCook+=element.name+' ';
    });

    console.log(this.noteForTheCook);
  }

  ngOnInit(): void {
  }
  onNoClick(): void {
    // console.log('It is hitting')
    this.dialogRef.close();
  }

  addToCart(item:SubCatagory,note:string="")
  {
    this.storage.setItem(item,note);
    this.onNoClick();
  }
}
