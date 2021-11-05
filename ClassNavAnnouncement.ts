import { Item } from 'sp-pnp-js';
import {ISpNavAnnouncementitem} from './INavAnnouncement';
export class ClassNavAnnouncement
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
   constructor(NavAnnouncementitem:ISpNavAnnouncementitem)
   {
       this.Title=NavAnnouncementitem.Title;
       this.ImageUrl=NavAnnouncementitem.ImageUrl;
       this.Image=NavAnnouncementitem.Image;
       

   }
}