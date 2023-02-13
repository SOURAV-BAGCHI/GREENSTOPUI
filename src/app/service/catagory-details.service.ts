import { Injectable } from '@angular/core';
import { Catagory } from '../models/catagory';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { config } from '../config';
import { delay, map, retryWhen, scan, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CatagoryDetailsService {

  constructor(private http:HttpClient) { }
  private hostAddress:string=config.hostname;
  private baseUrlCatagoryDetails:string=this.hostAddress+'api/CatagoryItem/GetCatagoryItemList';

//  private catagoryDetailsDummy=new BehaviorSubject<Catagory[]>(this.dummyCatagoryList());

  private catagoryDetails$:Observable<Catagory[]>;

  getCatagoryDetails():Observable<Catagory[]>
  {
    // this.catagoryDetails$=this.catagoryDetailsDummy;  
    this.catagoryDetails$=this.http.get<Catagory[]>(this.baseUrlCatagoryDetails)
    .pipe(
      shareReplay(),
      retryWhen(err=>err.pipe(
        delay(3000),
        scan((retryCount)=>{
            if(retryCount>=5)
            {
              throw err;
            }
            else
            {
              retryCount=retryCount+1;
              return retryCount;
            }
        },0)
      ))
    );
  //  return this.catagoryDetails$;
  return  this.catagoryDetails$.pipe(
      map(res=>{
        let tempdata:Catagory[]=[];
        res.forEach(element => {
          element.image=this.hostAddress+'Images/'+element.image;
          tempdata.push(element);
        });

        return tempdata;
      })
    );

  //  return this.catagoryDetails$;
  }

  private dummyCatagoryList():Catagory[]
  {
    let catagoryDetails:Catagory[]=[];

    catagoryDetails.push({
      id:1,name:'Mahabhoj',image:'',subcatagoryList:[
        {id:1,name:'Khichuri Mahabhoj',name2:'খিচুড়ি মহাভোজ ',detail:'(Niramish)',type:1,description:'Khichuri I Begun Bhaja (2 pcs) I Aloor Dam (4 pcs) I Papad I Chatni I Chanar  Gaja',price:120,quantity:1,image:''},
        {id:2,name:'Macher Mahabhoj',name2:'মাছের মহাভোজ  ',detail:'',type:1,description:'Bhat or Luchi or Bhat & Luchi I Dal I Begun Bhaja  (2 pcs) I Shukto I Doi Pona  (2 pcs) I Chatni I Papad I Misti Doi',price:280,quantity:1,image:''},
        {id:3,name:'Murgir Mahabhoj',name2:'মুরগির মহাভোজ  ',detail:'',type:1,description:'Bhat or Luchi or Bhat & Luchi I Dal I Begun Bhaja (2 pcs) I Shukto I Doi Murgi (3 pcs) I Chatni I Papad I Misti Doi',price:260,quantity:1,image:''},
        {id:4,name:'Mangser Mahabhoj',name2:'মাংসের  মহাভোজ  ',detail:'',type:1,description:'Bhat or Luchi or Bhat & Luchi I Dal I Begun Bhaja (2 pcs) I Shukto I Kasha Manshsho  (3 pcs) I Chatni I Papad I Misti Doi',price:320,quantity:1,image:''},
        {id:5,name:'Niramisher Mahabhoj ',name2:'নিরামিষের মহাভোজ  ',detail:'',type:2,description:'Bhat or Luchi or Bhat & Luchi I Dal I Begun Bhaja (2 pcs) I Shukto I Dhokar Dalna I Aloo Posto I Chatni I Papad I Misti Doi',price:220,quantity:1,image:''}
      ]
    });
    catagoryDetails.push({
      id:1,name:'Snacks',image:'',subcatagoryList:[
        {id:6,name:'Aloor Chop',name2:'আলুর চপ ',detail:'(4 pcs)',type:2,description:'',price:40,quantity:1,image:''},
        {id:7,name:'Dimer Chop',name2:'ডিমের চপ  ',detail:'(2 pcs)',type:2,description:'',price:40,quantity:1,image:''},
        {id:8,name:'Chicken Pakora',name2:'চিকেন পকোড়া  ',detail:'(4 pcs)',type:2,description:'',price:100,quantity:1,image:''},
        {id:9,name:'Mochar Chop',name2:'মোচার চপ  ',detail:'(2 pcs)',type:2,description:'',price:50,quantity:1,image:''},
        {id:10,name:'Mashsher Keema Diye Ghugni',name2:'মাংসের কিমার ঘুগন   ',detail:'',type:2,description:'',price:220,quantity:1,image:''},
        {id:11,name:'Luchi & Aloor Dam',name2:'লুচি এবং আলুরদম ',detail:'(4 pcs)',type:2,description:'',price:50,quantity:1,image:''},
        {id:12,name:'Chicken Stew (2 pcs) & Bread Toast (3 pcs)',name2:'চিকেন স্টু (দু পিস ) এবং পাউরুটি টোস্ট (তিন পিস)  ',detail:'',type:2,description:'',price:120,quantity:1,image:''},
        {id:13,name:'Vegetable Stew & Bread Toast ',name2:'ভেজিটেবল স্টু এবং পাউরুটি টোস্ট ',detail:'(3 pcs)',type:2,description:'',price:80,quantity:1,image:''},
        {id:14,name:'Chichen Sandwich',name2:'চিকেন স্যান্ডউইচ  ',detail:'',type:2,description:'',price:60,quantity:1,image:''}
      ]
    });
    // catagoryDetails.push({
    //   id:2,name:'Starters',image:'',subcatagoryList:[
    //     {id:3,name:'Vegetable Samosa',description:'2 pieces. Spiced potatoes + peas inside a crispy turnover. Housemade tamarind chutney + cilantro-mint chutneys.',price:50,quantity:1,image:''},
    //     {id:4,name:'Vegetable Pakora',description:'Potatoes, onion, cauliflower, carrot, zucchini and spinach fried in chickpea-flour batter. Served with housemade tamarind + cilantro-mint chutneys.',price:50,quantity:1,image:''}  
    //   ]
    // });
    // catagoryDetails.push({
    //   id:2,name:'Starters',image:'',subcatagoryList:[
    //     {id:5,name:'Vegetable Samosa',description:'2 pieces. Spiced potatoes + peas inside a crispy turnover. Housemade tamarind chutney + cilantro-mint chutneys.',price:50,quantity:1,image:''},
    //     {id:6,name:'Vegetable Pakora',description:'Potatoes, onion, cauliflower, carrot, zucchini and spinach fried in chickpea-flour batter. Served with housemade tamarind + cilantro-mint chutneys.',price:50,quantity:1,image:''},
    //     {id:7,name:'Momos - Chicken',description:'Nepali steamed dumplings stuffed with spiced ground chicken and served with roasted tomato–Szechwan pepper chutney.',price:90,quantity:1,image:''},
    //     {id:8,name:'Momos - Veggie',description:'Nepali steamed dumplings stuffed with spiced vegan mix (cabbage, potato, cauliflower, green onion) and served with roasted tomato–Szechwan pepper chutney.',price:50,quantity:1,image:''},
    //     {id:9,name:'Stir-Fried Shrimp',description:'Shrimp stir-fried with bell peppers and a touch of chili-soy sauce.',price:80,quantity:1,image:''}  
    //   ]
    // });
    // catagoryDetails.push({
    //   id:3,name:'Chicken Curries',image:'',subcatagoryList:[
    //     {id:10,name:'Chicken Curry',description:'Boneless chicken breast, tomato-based curry sauce. Served with basmati rice. Order mild, medium or hot spice level.',price:130,quantity:1,image:''},
    //     {id:11,name:'Chicken Tikka Masala',description:'Chicken tikka (tender, tandoori-roasted, marinated boneless breast), tomato and onion in creamy tomato curry sauce. Served with basmati rice. Order mild, medium or hot spice level.',price:140,quantity:1,image:''},
    //     {id:12,name:'Chicken Makhni',description:'Chicken tikka (tender, tandoori-roasted, marinated boneless breast), creamy tomato + cashew paste curry sauce. Served with basmati rice. Order mild, medium or hot spice level.',price:140,quantity:1,image:''},
    //     {id:13,name:'Chicken Korma',description:'Boneless chicken breast, creamy cashew + almond sauce. Served with basmati rice. Order mild, medium or hot spice level.',price:150,quantity:1,image:''}    
    //   ]
    // }); 

    return catagoryDetails;
  }

  // clear cache
  clearCache(){
    this.catagoryDetails$=null;
  }
}
