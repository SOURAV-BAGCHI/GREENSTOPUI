import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { config } from 'src/app/config';
import { CatagoryItemInsertUpdateDialogComponent } from 'src/app/dialog/catagory-item-insert-update-dialog/catagory-item-insert-update-dialog.component';
import { ItemListDialogComponent } from 'src/app/dialog/item-list-dialog/item-list-dialog.component';
import { CatagoryDetailsInsertUpdateService } from 'src/app/service/catagory-details-insert-update.service';
import { SnackbarService } from 'src/app/service/snackbar.service';

export interface CatagoryElement {
  id:number;
  name: string;
  available:boolean
}

@Component({
  selector: 'app-modify-catagory-item-list',
  templateUrl: './modify-catagory-item-list.component.html',
  styleUrls: ['./modify-catagory-item-list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ])
  ]
})
export class ModifyCatagoryItemListComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private fb:FormBuilder,
    private snackbar:SnackbarService,
    private _snackBar: MatSnackBar,
    private catagoryItemInsertUpdateService:CatagoryDetailsInsertUpdateService
  ) { }


  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  columnsToDisplay = ['id','name', 'available','actions'];
  expandedElement: CatagoryElement | null;
  dataSource:any;
  isLoadingResults:boolean=false;
  hostname:string=config.hostname+"Images/";

  ngOnInit(): void {
    this.loadData(0);
  }

  loadData(pagenumber:number):void
  {
    this.isLoadingResults=true;
    this.catagoryItemInsertUpdateService.getCatagoryList().subscribe(res=>{
      this.dataSource=res;

      console.log(this.dataSource);
      this.isLoadingResults=false;
    },
    error=>{
      this.isLoadingResults=false;
    })
  }

  loadCatagoryInsertUpdateDlg(id:number,isCatagoryOperation:boolean,isUpdate:boolean,catagoryid:number=0)
  {
    let dlgData={id:id,isCatagoryOperation:isCatagoryOperation,isUpdate:isUpdate,additionalid:catagoryid};
    const dialogRef = this.dialog.open(CatagoryItemInsertUpdateDialogComponent, {
      width: '300px',
      // data: {name: this.name, phone: this.phone,email:this.email,type:'user'}
      data:dlgData
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined)
      { 
        if( result!="" && result>0)
        {
          if(isCatagoryOperation)
          {
            this.loadData(0);
          }
          else
          {
            this.loadCatagoryItemListDlg(catagoryid);
          }
        }
        
      }
    });
  }

  loadCatagoryItemListDlg(id:number)
  {
    let dlgData={id:id};
    const dialogRef = this.dialog.open(ItemListDialogComponent, {
      width: '300px',
      // data: {name: this.name, phone: this.phone,email:this.email,type:'user'}
      data:dlgData
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result!=undefined)
      {
        if( result!=null && result.success==true)
        {
          // console.log(result);
          this.loadCatagoryInsertUpdateDlg(result.id,false,result.isUpdateRequest,id);
        }
        
      }
    });
  }

  deleteCatagory(id:number) {
    let msg=('This will delete the catagory and all included items');
    
    this._snackBar.open( msg, 'Proceed', {
      duration: 3000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
    });

    
    this._snackBar._openedSnackBarRef.onAction().subscribe(
      ()=>{
        // console.log('delete catagory');
        this.isLoadingResults=true;
        this.catagoryItemInsertUpdateService.deleteCatagoryDetails(id).subscribe(res=>{
          this.isLoadingResults=false;
          this.loadData(0);
        },
        error=>{
          this.isLoadingResults=false;
        })
      }
    )

  }

}
