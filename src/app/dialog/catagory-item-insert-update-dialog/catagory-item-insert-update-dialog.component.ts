import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatagoryDetails } from 'src/app/models/catagory-details';
import { ItemDetails } from 'src/app/models/item-details';
import { CatagoryDetailsInsertUpdateService } from 'src/app/service/catagory-details-insert-update.service';
import { SnackbarService } from 'src/app/service/snackbar.service';

@Component({
  selector: 'app-catagory-item-insert-update-dialog',
  templateUrl: './catagory-item-insert-update-dialog.component.html',
  styleUrls: ['./catagory-item-insert-update-dialog.component.css']
})
export class CatagoryItemInsertUpdateDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<CatagoryItemInsertUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
    private catagoryItemInsertUpdateService:CatagoryDetailsInsertUpdateService,
    private _formBuilder: FormBuilder,
    private snackbar:SnackbarService) { }

    catagoryDetails:CatagoryDetails;
    isCatagoryOperation:boolean=false;
    isUpdate:boolean=false;

    isDataLoaded:boolean=false;

    catagoryFG:FormGroup;
    itemFG:FormGroup;
    title:string='';
    toggleColor:string="primary";

    public progress: number;
    public message: string;
    private success:boolean=false;
    private additionalid:number=0;

  ngOnInit(): void {

    this.isCatagoryOperation=this.data.isCatagoryOperation;
    this.isUpdate=this.data.isUpdate;
    this.additionalid=this.data.additionalid;

    // console.log(this.isCatagoryOperation +" "+ this.isUpdate);

    if(this.isCatagoryOperation)
    {
      if(this.isUpdate)
      {
        this.catagoryItemInsertUpdateService.getCatagoryDetails(this.data.id).subscribe(res=>{
          this.catagoryDetails=res;

          this.catagoryFG=this._formBuilder.group({
            name:[res.name,[Validators.required]],
            priority:[res.priority,[Validators.required]],
            available:[res.available,[Validators.required]],
            filename:[res.image,[Validators.required]],
            file: [''],
            fileSource: []
          })
          this.title="Update catagory details";
          this.isDataLoaded=true;
        })
      }
      else
      {
        this.catagoryDetails={id:0,name:'',image:'',priority:0,available:false};
        this.catagoryFG=this._formBuilder.group({
          name:['',[Validators.required]],
          priority:[0,[Validators.required]],
          available:[true,[Validators.required]],
          filename:['',[Validators.required]],
          file: ['',[Validators.required]],
          fileSource: ['',[Validators.required]]
        })

        this.title="Create catagory details"
        this.isDataLoaded=true;
      }
    }
    else
    {
      if(this.isUpdate)
      {
        this.catagoryItemInsertUpdateService.getItemDetails(this.data.id).subscribe(res=>{
          this.itemFG=this._formBuilder.group({
            name1:[res.name1,[Validators.required]],
            name2:[res.name2],
            detail:[res.detail,[Validators.required]],
            detail2:[res.detail2],
            type:[res.type,[Validators.required]],
            description:[res.description,[Validators.required]],
            description2:[res.description2],
            price:[res.price,[Validators.required]],
            available:[res.available,[Validators.required]]
          })

          this.isDataLoaded=true;
        })
      }
      else
      {
        this.itemFG=this._formBuilder.group({
          name1:['',[Validators.required]],
          name2:[''],
          detail:['',[Validators.required]],
          detail2:[''],
          type:[1,[Validators.required]],
          description:['',[Validators.required]],
          description2:[''],
          price:[0,[Validators.required]],
          available:['',[Validators.required]]
        })
        this.isDataLoaded=true;
      }
    }

  }

  onFileChange(event) {
  
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.catagoryFG.patchValue({
        fileSource: file
      });
    }
  }

  catagorySubmit()
  {
    let formData=new FormData();
    if(this.catagoryFG.get('fileSource').value!=null)
    formData.append('file',this.catagoryFG.get('fileSource').value,'noname.jpg');
    formData.append('name',this.catagoryFG.controls.name.value);
    formData.append('image',this.catagoryFG.controls.filename.value);
    formData.append('priority',this.catagoryFG.controls.priority.value);
    formData.append('available',this.catagoryFG.controls.available.value);

    if(this.isUpdate)
    {
      this.catagoryItemInsertUpdateService.updateCatagoryDetails(this.catagoryDetails.id,formData)
      .subscribe(res=>{
        this.success=true;
        this.onNoClick();
        this.snackbar.openSnackBar('Record uploaded successfully','Success');
      },
      error=>{
        this.snackbar.openSnackBar('Something went wrong','Error');
      })
    }
    else
    {
      this.catagoryItemInsertUpdateService.createCatagoryDetails(formData)
      .subscribe(res=>{
        this.success=true;
        this.onNoClick();
        this.snackbar.openSnackBar('Record created successfully','Success');
      },
      error=>{
        this.snackbar.openSnackBar('Something went wrong','Error');
      })
    }

  }

  itemSubmit()
  {
    let itemDetails:ItemDetails={
      id:0,
      catagoryId:this.additionalid,
      name1:this.itemFG.controls.name1.value,
      name2:this.itemFG.controls.name2.value,
      detail:this.itemFG.controls.detail.value,
      detail2:this.itemFG.controls.detail2.value,
      type:this.itemFG.controls.type.value,
      description:this.itemFG.controls.description.value,
      description2:this.itemFG.controls.description2.value,
      price:Number(this.itemFG.controls.price.value),
      available:this.itemFG.controls.available.value
    }

    if(this.isUpdate)
    {
      this.catagoryItemInsertUpdateService.updateItemDetails(this.data.id,itemDetails).subscribe(res=>{
        this.success=true;
        this.onNoClick();
        this.snackbar.openSnackBar('Record created successfully','Success');
      },
      error=>{
        this.snackbar.openSnackBar('Something went wrong','Error');
      })
    }
    else
    {
      this.catagoryItemInsertUpdateService.createItemDetails(itemDetails).subscribe(res=>{
        this.success=true;
        this.onNoClick();
        this.snackbar.openSnackBar('Record created successfully','Success');
      },
      error=>{
        console.log(error);
        this.snackbar.openSnackBar('Something went wrong','Error');
      })
    }
  }

  onNoClick(): void {
    this.dialogRef.close(this.success);
  }
}
