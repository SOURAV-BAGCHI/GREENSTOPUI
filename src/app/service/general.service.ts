import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { config } from '../config';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http:HttpClient) { }

  private hostAddress:string=config.hostname;
  private baseUrlGetServerDateTime:string=this.hostAddress+'api/General/GetServerDateTime';

  public getServerDateTime()
  {
    return this.http.get(this.baseUrlGetServerDateTime);
  }
}
