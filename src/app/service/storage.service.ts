import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemIndividualCountModel } from '../models/item-individual-count-model';
import { StorageItem } from '../models/storage-item';
import { SubCatagory } from '../models/sub-catagory';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage:Storage=localStorage;
  private storageItemList:StorageItem[]=[];
  private storageListKey:string="itemList";
  private storageCountKey:string="itemCount";
  private sstorageCustomerInfoAvailabilityKey:string="iscustomerInfoAvailable";
  private itemIndividualCountKey:string="itemindividulaCount";
  private storageItemCount:number=0;
  private sstorage:Storage=sessionStorage;

  public itemCount=new BehaviorSubject<number>(this.getItemCount());
  public itemList=new BehaviorSubject<StorageItem[]>(this.getItem());
  public itemAddedToCart=new BehaviorSubject<boolean>(false);
  public orderPlaced=new BehaviorSubject<boolean>(false);
  private isCustomerInfoAvailable$=new BehaviorSubject<boolean>(this.customerInfoAvailable());
  public customerInfoDetails=new BehaviorSubject<any>(this.getCustomerInfo());
  private itemMaxCount:number=15;

  constructor(private _snackbar:SnackbarService) {
    // this.storage=localStorage;
    this.storageListKey="itemList";
    this.storageCountKey="itemCount";
    this.sstorageCustomerInfoAvailabilityKey="iscustomerInfoAvailable";
  }

  private updateitemIndividualCount(item:ItemIndividualCountModel):boolean
  {
    let isitemvalueChanged:boolean=false;
    let itemCountTemp:number=this.getItemIndividualCount(item.id);
 
    if((item.count>=0 && itemCountTemp<this.itemMaxCount) || (item.count<0 && itemCountTemp>0))
    {
      let itemIndividualCountList:ItemIndividualCountModel[]=[];
      if(this.storage.getItem(this.itemIndividualCountKey)!=null)
      {
        itemIndividualCountList=JSON.parse(this.storage.getItem(this.itemIndividualCountKey));

      }
      
      
      let tempindex:number=0;
      let tempcount:number=0;
      let itemfound:boolean=false;
      
      for(let ii=0;ii<itemIndividualCountList.length;ii++)
      {
        if(itemIndividualCountList[ii].id==item.id)
        {
          tempcount=itemIndividualCountList[ii].count;
          tempindex=ii;
          ii=itemIndividualCountList.length;
          itemfound=true;
        }
      }

      // itemIndividualCountList.every(function(element,index){

      //   if(element.id==item.id)
      //   {
      //     tempcount=element.count;
      //     tempindex=index;
      //     return false;
      //   }

      // });
      let newcount:number=tempcount+item.count;
      console.log('tempcount '+tempcount+ ' newcount '+newcount);
      
      if(newcount>this.itemMaxCount)
      {
        // issue snackbar for failure
        this._snackbar.openSnackBar(tempcount+"/"+this.itemMaxCount+ " of this item present in the cart, can add only "+ (this.itemMaxCount-tempcount)+" more","Info")

      }
      else
      {
        if(newcount>0)
        {
          if(itemIndividualCountList.length>0 && itemfound)
          itemIndividualCountList[tempindex].count=newcount;
          else
          itemIndividualCountList.push(item);
        }
        else
        {
          itemIndividualCountList.splice(tempindex,1);
        }

        this.storage.setItem(this.itemIndividualCountKey,JSON.stringify(itemIndividualCountList));
        isitemvalueChanged=true;

      }

    }
    else
    {
      this._snackbar.openSnackBar(itemCountTemp+"/"+this.itemMaxCount+ " of this item already present in the cart, cannot add more items","Info")
    }


    return isitemvalueChanged;
  }

  private getItemIndividualCount(itemId:number):number
  {
    let itemcnt:number=0;
    if(this.storage.getItem(this.itemIndividualCountKey)!=null)
    {
      // console.log(itemId);
      let itemIndividualCountList:ItemIndividualCountModel[]=JSON.parse(this.storage.getItem(this.itemIndividualCountKey));
      // console.log(this.storage.getItem("itemList"));
      for(let ii=0;ii<itemIndividualCountList.length;ii++)
      {
        if(itemIndividualCountList[ii].id==itemId)
        {
          itemcnt=itemIndividualCountList[ii].count;
          console.log(itemcnt);
          ii=itemIndividualCountList.length;
        }
      }
      
      
      // itemIndividualCountList.every(function(element,index){

      //   if(element.id==itemId)
      //   {
      //     itemcnt=element.count;
      //     console.log(itemcnt);
      //     return false;
      //   }

      // });
    }

    return itemcnt;
  }

  public getlocalStorage()
  {
    return localStorage;
  }

  public getsessionStorage()
  {
    return sessionStorage;
  }

  public setItem(item:SubCatagory,note:string=""):void{

    let tempItem:ItemIndividualCountModel={id:item.id,count:item.quantity};
    // console.log(tempItem);

    if(this.updateitemIndividualCount(tempItem))
    {
      let tempStorageItem:StorageItem={
        timestamp:Math.floor((new Date().valueOf())/1000),
        id:item.id,
        name:item.name,
        price:item.price,
        quantity:item.quantity,
        note:note
      };
  
      let itemNotPresent:boolean=true;
  
      if(this.storage.getItem(this.storageListKey)!=null)
      {
        this.storageItemList=JSON.parse(this.storage.getItem(this.storageListKey));
        this.storageItemCount=parseInt(this.storage.getItem(this.storageCountKey),10);
      }
      
      this.storageItemList.every(function(element,index){
        if(element.id==item.id)
        {
          if(element.note==note)
          {
            element.quantity+=item.quantity;
            itemNotPresent=false;
          }
          else
          {
            itemNotPresent=true;
          }
          
          return itemNotPresent;
        }
  
        return itemNotPresent;
      });
      
      if(itemNotPresent)
      {
        this.storageItemList.push(tempStorageItem);
      }
      this.storage.setItem(this.storageListKey,JSON.stringify(this.storageItemList));
  
      this.storageItemCount+=tempStorageItem.quantity;
      this.storage.setItem(this.storageCountKey,this.storageItemCount.toString());
  
      this.itemList.next(this.storageItemList);
      this.itemCount.next(this.storageItemCount);
      this.itemAddedToCart.next(true);
    }
    
  }

  private getItem():StorageItem[]{
    if(this.storage.getItem(this.storageListKey)!=null)
    {
      this.storageItemList=JSON.parse(this.storage.getItem(this.storageListKey));
    }
    else{
      this.storageItemList=[];
    }

    return this.storageItemList;
  }

  public getItemCount():number{
    if(this.storage.getItem(this.storageCountKey)!=null) 
    {
      this.storageItemCount=parseInt(this.storage.getItem(this.storageCountKey),10);
    }
    else
    {
      this.storageItemCount=0;
    }
    
    // console.log(this.storage);

    return this.storageItemCount;
  }

  public addItem(id:number,timestamp:number,quantity:number=1):boolean
  {
    let isUpdateSuccessful:boolean=false;
    let tempItem:ItemIndividualCountModel={id:id,count:quantity};
     console.log(timestamp);
    if(this.updateitemIndividualCount(tempItem))
    {
      this.storageItemList=this.getItem();
      // console.log(this.storageItemList);
      // this.storageItemList.every(function(element,index){
        
        
      //   if(element.timestamp==timestamp)
      //   {
          
      //     element.quantity+=quantity;
      //     return false;
      //   } 
      // })

      for(let i=0;i<this.storageItemList.length;i++)
      {
          if(this.storageItemList[i].timestamp==timestamp)
          {
            
            this.storageItemList[i].quantity+=quantity;
            i=this.storageItemList.length;
          } 
      }

      this.storageItemCount=this.getItemCount()+quantity;

      this.storage.setItem(this.storageListKey,JSON.stringify(this.storageItemList));
      this.storage.setItem(this.storageCountKey,this.storageItemCount.toString());

      this.itemCount.next(this.storageItemCount);
     
      // this.itemList.next(this.storageItemList);

      isUpdateSuccessful=true;
    }

    return isUpdateSuccessful;
  }

  public removeItem(timestamp:number)
  {
    this.getItem();
    let item_index=0;
    let item_quantity=0;
    let item_id=0;
    for(let index=0;index<this.storageItemList.length;index++)
    {
      if(this.storageItemList[index].timestamp==timestamp)
      {
        item_index=index;
        item_id=this.storageItemList[index].id;
        item_quantity=this.storageItemList[index].quantity;
        index=this.storageItemList.length;
      }
    }


    let tempItem:ItemIndividualCountModel={id:item_id,count:-item_quantity};
    this.updateitemIndividualCount(tempItem);

    this.storageItemList.splice(item_index,1);
    this.getItemCount();
    this.storageItemCount-=item_quantity;
    if(this.storageItemCount>0)
    {
      this.storage.setItem(this.storageListKey,JSON.stringify(this.storageItemList));
      this.storage.setItem(this.storageCountKey,this.storageItemCount.toString());
    }
    else
    {
      this.storage.removeItem(this.storageListKey);
      this.storage.removeItem(this.storageCountKey);
    }

    this.itemCount.next(this.storageItemCount);
    this.itemList.next(this.storageItemList);
  }

  resetAll()
  {
    this.storage.removeItem(this.storageListKey);
    this.storage.removeItem(this.storageCountKey);
    this.storage.removeItem(this.itemIndividualCountKey);
    
    this.storageItemCount=0;
    this.storageItemList=[];

    this.itemCount.next(this.storageItemCount);
    this.itemList.next(this.storageItemList);
    // this.orderPlaced.next(true);
  }

  customerInfoAvailable():boolean
  {
    // let dataavailable:boolean=false;
    return (this.sstorage.getItem(this.sstorageCustomerInfoAvailabilityKey)!=null)
  }

  get isCustomerInfoAvailable()
  {
    return this.isCustomerInfoAvailable$.asObservable();
  }

  public setCustomerInfo(data:string)
  {
    // console.log(data);
    this.sstorage.setItem(this.sstorageCustomerInfoAvailabilityKey, JSON.stringify(data));
    this.isCustomerInfoAvailable$.next(true);
    this.customerInfoDetails.next(this.getCustomerInfo());
  }

  public getCustomerInfo():any
  {
    let customerInfo=null;
    if(this.sstorage.getItem(this.sstorageCustomerInfoAvailabilityKey)!=null)
      customerInfo=JSON.parse(this.sstorage.getItem(this.sstorageCustomerInfoAvailabilityKey));

    return customerInfo;
  }

  public removeCustomerInfo()
  {
    this.sstorage.removeItem(this.sstorageCustomerInfoAvailabilityKey);
    this.isCustomerInfoAvailable$.next(false);
  }
  
}
