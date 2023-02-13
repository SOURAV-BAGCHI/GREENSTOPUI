import { SubCatagory } from './sub-catagory';

export interface Catagory {
    id:number;
    name:string;
    image:string;
    subcatagoryList:SubCatagory[];
}
