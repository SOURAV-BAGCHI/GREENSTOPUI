import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { CatagoryDetailsInsertUpdateService } from 'src/app/service/catagory-details-insert-update.service';
import { SnackbarService } from 'src/app/service/snackbar.service';

export interface ItemElement {
  id:number;
  name: string;
  available:boolean
}

@Component({
  selector: 'app-item-list-dialog',
  templateUrl: './item-list-dialog.component.html',
  styleUrls: ['./item-list-dialog.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ItemListDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ItemListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private catagoryItemInsertUpdateService:CatagoryDetailsInsertUpdateService,
    // private _formBuilder: FormBuilder,
    private snackbar:SnackbarService,
    private _snackBar: MatSnackBar) { }

    columnsToDisplay = ['name', 'available','actions'];
    expandedElement: ItemElement | null;
    dataSource:any;
    itemId:number=0;
    isLoadingResults:boolean=false;
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    success:boolean=false;
    returnData:any={success:false,isUpdateRequest:false,id:0};

  ngOnInit(): void {
    this.itemId=this.data.id;
    // console.log(this.data.id);
    this.loadData(0);
  }

  loadData(pageno:number)
  {
    this.isLoadingResults=true;
    this.catagoryItemInsertUpdateService.getCatagoryItemListByCatagoryId(this.itemId).subscribe(res=>{
      this.dataSource=res;

      // console.log(this.dataSource);
      this.isLoadingResults=false;
    },
    error=>{
      this.isLoadingResults=false;
    })
  }

  deleteItem(id:number) {
    let msg=('This will delete the item permanently');
    
    this._snackBar.open( msg, 'Proceed', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    
    this._snackBar._openedSnackBarRef.onAction().subscribe(
      ()=>{
        // console.log('delete catagory');
        this.isLoadingResults=true;
        this.catagoryItemInsertUpdateService.deleteItemDetail(id).subscribe(res=>{
          this.isLoadingResults=false;
          this.loadData(0);
        },
        error=>{
          this.isLoadingResults=false;
        })
      }
    )

  }

  updateOrCreateRecord(id:number,isUpdate:boolean)
  {
    this.returnData.success=true;
    this.returnData.id=id;
    this.returnData.isUpdateRequest=isUpdate;

    this.onNoClick();
  }

  onNoClick(): void {
    this.dialogRef.close(this.returnData);
  }

}
