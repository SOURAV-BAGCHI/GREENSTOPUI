import { HttpClient } from '@angular/common/http';
import { identifierModuleUrl, ThrowStmt } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from '../config';
import { Catagory } from '../models/catagory';
import { CatagoryDetails } from '../models/catagory-details';
import { ItemDetails } from '../models/item-details';

@Injectable({
  providedIn: 'root'
})
export class CatagoryDetailsInsertUpdateService {

  constructor(private http:HttpClient) { }

  private hostAddress:string=config.hostname;
  private baseUrlGetCatagoryList:string=this.hostAddress+'api/CatagoryItemsOperation/GetCatagoryList';
  private baseUrlGetCatagoryDetails:string=this.hostAddress+'api/CatagoryItemsOperation/GetCatagoryDetails';
  private baseUrlDeleteCatagoryDetails:string=this.hostAddress+'api/CatagoryItemsOperation/DeleteCatagoryDetails';
  private baseUrlUpdateCatagoryDetails:string=this.hostAddress+'api/CatagoryItemsOperation/UpdateCatagoryDetails';
  private baseUrlCreateCatagoryDetails:string=this.hostAddress+'api/CatagoryItemsOperation/CreateCatagoryDetails';
  private baseUrlGetCatagoryItemListByCatagoryId:string=this.hostAddress+'api/CatagoryItemsOperation/GetCatagoryItemListByCatagoryId';
  private baseUrlDeleteItemDetail:string=this.hostAddress+'api/CatagoryItemsOperation/DeleteItemDetail';
  private baseUrlGetItemDetails:string=this.hostAddress+'api/CatagoryItemsOperation/GetItemDetails';
  private baseUrlCreateItemDetails:string=this.hostAddress+'api/CatagoryItemsOperation/CreateItemDetails';
  private baseUrlUpdateItemDetails:string=this.hostAddress+'api/CatagoryItemsOperation/UpdateItemDetails';

  public getCatagoryList():Observable<CatagoryDetails[]>
  {
    return this.http.get<CatagoryDetails[]>(this.baseUrlGetCatagoryList);
  }

  public getCatagoryDetails(id:number):Observable<CatagoryDetails>
  {
    return this.http.get<CatagoryDetails>(this.baseUrlGetCatagoryDetails+'/'+id);
  }

  public deleteCatagoryDetails(id:number)
  {
    return this.http.delete(this.baseUrlDeleteCatagoryDetails+'/'+id);
  }

  public updateCatagoryDetails(id:number,formdata:FormData)
  {
    return this.http.put(this.baseUrlUpdateCatagoryDetails+'/'+id,formdata);
  }

  public createCatagoryDetails(formdata:FormData)
  {
    return this.http.post(this.baseUrlCreateCatagoryDetails,formdata);
  }

  public getCatagoryItemListByCatagoryId(id:number):Observable<ItemDetails[]>
  {
    // console.log(id);
    return this.http.get<ItemDetails[]>(this.baseUrlGetCatagoryItemListByCatagoryId+'/'+id);
  }

  public deleteItemDetail(id:number)
  {
    return this.http.delete(this.baseUrlDeleteItemDetail+'/'+id);
  }

  public getItemDetails(id:number):Observable<ItemDetails>
  {
    return this.http.get<ItemDetails>(this.baseUrlGetItemDetails+'/'+id);
  }

  public createItemDetails(data:ItemDetails)
  {
    // console.log(data);
    return this.http.post(this.baseUrlCreateItemDetails,data);
  }

  public updateItemDetails(id:number,data:ItemDetails)
  {
    // console.log(data);
    return this.http.put(this.baseUrlUpdateItemDetails+'/'+id,data);
  }
}
