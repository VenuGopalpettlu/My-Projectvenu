import { Item } from 'sp-pnp-js';
import {ISpAnnouncementitem} from './IAnnouncement';
export class ClassAnnouncement
{
   public Title:string;
   public  Image:{
    Description:string,
    Url:string
  };
   public ImageUrl:{
    Description:string,
    Url:string
  };
  public ID:number;
  public OrderLink:number;
   constructor(Announcementitem:ISpAnnouncementitem)
   {
       this.Title=Announcementitem.Title;
       this.ImageUrl=Announcementitem.ImageUrl;
       this.Image=Announcementitem.Image;
       this.ID=Announcementitem.ID;
       this.OrderLink=Announcementitem.OrderLink;
       

   }
}