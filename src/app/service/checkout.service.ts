import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PinAvailabilityDetails } from '../models/pin-availability-details';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor() { }
  private hostAddress:string='http://localhost:5000/';
  private baseUrlCatagoryDetails:string=this.hostAddress+'api/Checkout/GetPincodeAvailability';

  private pincodeList:PinAvailabilityDetails[]=[
    {pincode:'700095',thresholdamt:600,deliveryCharge:35},
    {pincode:'700047',thresholdamt:600,deliveryCharge:35},
    {pincode:'700045',thresholdamt:600,deliveryCharge:35},
    {pincode:'700040',thresholdamt:600,deliveryCharge:35},

    {pincode:'700107',thresholdamt:600,deliveryCharge:30},
    {pincode:'700099',thresholdamt:600,deliveryCharge:30},
    {pincode:'700094',thresholdamt:600,deliveryCharge:30},
    {pincode:'700068',thresholdamt:600,deliveryCharge:30}, 
    {pincode:'700042',thresholdamt:600,deliveryCharge:30},

    {pincode:'700092',thresholdamt:600,deliveryCharge:25},
    {pincode:'700086',thresholdamt:600,deliveryCharge:25},
    {pincode:'700078',thresholdamt:600,deliveryCharge:25},
    {pincode:'700075',thresholdamt:600,deliveryCharge:25},
    // {pincode:'700029',thresholdamt:500,deliveryCharge:35},
    {pincode:'700032',thresholdamt:600,deliveryCharge:25},
    {pincode:'700031',thresholdamt:600,deliveryCharge:25}
  ];

  private checkPincodeAvailability$:Observable<PinAvailabilityDetails>;

  // private pinAvailability=new BehaviorSubject<PinAvailabilityDetails>(this.isPincodeAvailable(""));

  public checkPincodeAvailability(pincode:string,totalprice:number)
  {
    let tempPincode:PinAvailabilityDetails={pincode:'None',thresholdamt:0,deliveryCharge:0};

    for(let i=0;i<this.pincodeList.length;i++)
    {
      if(this.pincodeList[i].pincode==pincode)
      {
        tempPincode.pincode=this.pincodeList[i].pincode;
        if(totalprice<this.pincodeList[i].thresholdamt)
        {
          tempPincode.deliveryCharge=this.pincodeList[i].deliveryCharge;
          tempPincode.thresholdamt=this.pincodeList[i].thresholdamt;
          tempPincode.pincode=this.pincodeList[i].pincode;
        }
        else
        {
          tempPincode.deliveryCharge=0;
        }
        

        i=this.pincodeList.length;
      }
    }

    return tempPincode;
  }

  // checkPincodeAvailability():Observable<PinAvailabilityDetails>
  // {
  //   this.checkPincodeAvailability$=this.pinAvailability;  

  //   return this.checkPincodeAvailability$;

  // }

}
