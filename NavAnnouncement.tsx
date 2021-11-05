import * as React from 'react';
import styles from './NavAnnouncement.module.scss';
import { INavAnnouncementProps } from './INavAnnouncementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { sp, Item, ItemAddResult, ItemUpdateResult,Fields, Items } from "sp-pnp-js";
import { ClassNavAnnouncement } from './ClassNavAnnouncement';
import { SPComponentLoader } from '@microsoft/sp-loader';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
const url : any = new URL(window.location.href);

const getitemID = url.searchParams.get("Itemid");

//alert(mvp);
interface getAnnouncementVal
{
  navAnntItems:any[];
   getImageUrl:string;
legetTitle:string;
Body:string;
likeStatus:string;
pageviewCount:number;
listitemid:number;
finalViewPage:number;
itemCount:number;
LikeCount:number;
UserLikes:string;
Userlistid:number;
LikeIcon:string;
ViewInconUrl:string;
}
export default class NavAnnouncement extends React.Component<INavAnnouncementProps, getAnnouncementVal> {
  public  constructor(props:INavAnnouncementProps)
  {
    super(props);
    this.state=
    {
      navAnntItems:[],
      legetTitle:"",
    getImageUrl:"",
    Body:"",
    likeStatus:"Like",
    pageviewCount:0,
    listitemid:0,
    finalViewPage:0,
    itemCount:0,
    LikeCount:0,
    UserLikes:"",
    Userlistid:0,
    LikeIcon:"",
    ViewInconUrl:""


    };
   
    

  }
 
  
 
  public render(): React.ReactElement<INavAnnouncementProps> {

    
    return (
     
     <div  className="App">

<div className={"Navtop-left"}>{this.state.legetTitle}</div>
<div>
<img src= {this.state.getImageUrl} className={"NavimageSlider"} />
</div>
<div>{ReactHtmlParser(this.state.Body)}</div>
<div className="NavDivheight"></div>
<div className="collum">

 <div id="divLike" className="blocks">
 
 <button>
   <img src={this.state.LikeIcon} alt="my image" onClick={this.likeMe} className="NavimgLink" />

   </button>
  <h4>
  <span className = "lksLike">{ this.state.likeStatus}</span></h4>

  
 
       
 </div>
 <div className="DivView">

 <h4>
 <img src= {this.state.ViewInconUrl} alt="my image"  className="NavimgViews" />
       <span className = "lblView">{ this.state.finalViewPage} Views </span></h4>
</div>
 </div>
     </div>
     
     
    );
  }
  public async componentDidMount()
  {
    pnp.setup({
      sp: {
        baseUrl: this.props.webpartcontext.pageContext.web.absoluteUrl,
      },
    });
    //alert(pnp.sp)
    let test1=this.props.webpartcontext.pageContext.user.displayName;
     //alert(test1);
    
    //debugger;
    this.setState({ViewInconUrl:this.props.webpartcontext.pageContext.web.absoluteUrl+"/Shared%20Documents/Icons/Views.png"});
    SPComponentLoader.loadCss(this.props.webpartcontext.pageContext.web.absoluteUrl+"/Shared%20Documents/WITTecCSS/NavAnnouncement.css");
    let getAnnouncementitem: any = await sp.web.lists.getByTitle("Announcement").items.getById(getitemID).get();
   // alert(getAnnouncementitem.length);
    this.setState({legetTitle:getAnnouncementitem.Title,getImageUrl:JSON.parse(getAnnouncementitem.Image).serverUrl+JSON.parse(getAnnouncementitem.Image).serverRelativeUrl,Body:getAnnouncementitem.Body});
    
    const allItems: any[] = await sp.web.lists.getByTitle("Announcement-Page-View").items.select("Title","ViewCount","ID").filter("Title eq "+getitemID).getAll();
//alert(allItems.length);
this.setState({pageviewCount:allItems.length});
  
if(allItems.length>0)
{
  this.setState({pageviewCount:allItems.length,listitemid:allItems[0].ID,itemCount:allItems[0].ViewCount});
  
}
//All Count items
const allLikeCount: any[] = await sp.web.lists.getByTitle("AnnouncementLikes").items.select("AnnouncementID","Like").filter("Like eq 'Yes' and AnnouncementID eq "+getitemID).getAll();
this.setState({LikeCount:allLikeCount.length});
//alert(allLikeCount.length)
//All Login Count
const allMyLike: any[] = await sp.web.lists.getByTitle("AnnouncementLikes").items.select("AnnouncementID","Title","Like","ID").filter("AnnouncementID eq "+getitemID +" and Title eq '" + this.props.webpartcontext.pageContext.user.email+"' " ).getAll();
//alert(allMyLike.length);
//this.setState({Userlistid:allMyLike[0].ID});
if(allMyLike.length==0)
{
  this.setState({likeStatus:' '+  this.state.LikeCount  + ' people liked this',UserLikes:"",LikeIcon:this.props.webpartcontext.pageContext.web.absoluteUrl+"/Shared%20Documents/Icons/Like.png"});
}
else if(allMyLike[0].Like=="Yes")
{
  
  this.setState({likeStatus:'You and '+ (this.state.LikeCount-1)  + ' people liked this',Userlistid:allMyLike[0].ID,UserLikes:allMyLike[0].Like,LikeIcon: this.props.webpartcontext.pageContext.web.absoluteUrl+"/Shared%20Documents/Icons/SelectLike.png"});
}
else if(allMyLike[0].Like=="No")
{
  this.setState({likeStatus:' '+ this.state.LikeCount  + ' people liked this',Userlistid:allMyLike[0].ID,UserLikes:allMyLike[0].Like,LikeIcon: this.props.webpartcontext.pageContext.web.absoluteUrl+"/Shared%20Documents/Icons/Like.png"});

}
//this.setState({LikeCount:allMyLike.length});

 if(this.state.pageviewCount==0 )
 {
  sp.web.lists.getByTitle("Announcement-Page-View").items.add({  
    Title:getitemID,
    
    ViewCount:1
  }); 
  this.setState({finalViewPage:1});
  //alert(this.state.finalViewPage)
 }
 else
 {
  sp.web.lists.getByTitle("Announcement-Page-View").items.getById(this.state.listitemid).update({    

    ViewCount:this.state.itemCount+1
  }); 
  this.setState({finalViewPage:this.state.itemCount+1});
  //alert(this.state.finalViewPage)
 }

  }
  
  private likeMe = async () => {
    const allMyLike: any[] = await sp.web.lists.getByTitle("AnnouncementLikes").items.select("AnnouncementID","Title","Like","ID").filter("AnnouncementID eq "+getitemID +" and Title eq '" + this.props.webpartcontext.pageContext.user.email+"' " ).getAll();
//alert(allMyLike.length);

    if(allMyLike.length==0)
    {

     sp.web.lists.getByTitle('AnnouncementLikes').items.add({  
      Title:this.props.webpartcontext.pageContext.user.email,
      UserName:this.props.webpartcontext.pageContext.user.displayName,
      AnnouncementID:getitemID,
      Like:'Yes'


    }); 
   // alert('Add'); 
    this.setState({likeStatus:'You and '+ this.state.LikeCount+ ' people liked this',LikeIcon:this.props.webpartcontext.pageContext.web.absoluteUrl+"/Shared%20Documents/Icons/SelectLike.png"});
  }
  else if(allMyLike[0].Like=="No")
  {
    sp.web.lists.getByTitle('AnnouncementLikes').items.getById(allMyLike[0].ID).update({    

      Like:'Yes'  
        
 
   }); 
     
   this.setState({likeStatus:' You and '+  (allMyLike.length)  + ' people liked this',LikeIcon:this.props.webpartcontext.pageContext.web.absoluteUrl+"/Shared%20Documents/Icons/SelectLike.png"});
  // alert('Updated');

  }
  else if(allMyLike[0].Like=="Yes")
  {
    sp.web.lists.getByTitle('AnnouncementLikes').items.getById(allMyLike[0].ID).update({    

      Like:'No'  
        
 
   }); 
     
   this.setState({likeStatus:' '+  allMyLike.length  + ' people liked this',LikeIcon:this.props.webpartcontext.pageContext.web.absoluteUrl+"/Shared%20Documents/Icons/Like.png"});

  }
     
    
}
 

}
