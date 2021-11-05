import * as React from 'react';
import styles from './Announcement.module.scss';
import { IAnnouncementProps } from './IAnnouncementProps';
import { escape } from '@microsoft/sp-lodash-subset';
import pnp, { sp, Item, ItemAddResult, ItemUpdateResult,Fields, Items } from "sp-pnp-js";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { SPComponentLoader } from '@microsoft/sp-loader';
import { ClassAnnouncement } from './ClassAnnouncement';
//const parentUrl='https://wabtec.sharepoint.com/sites/DEV-WITECmyCONNECTION/SitePages/Announcement.aspx?Itemid=';

interface announcementState {

  anntItems:any[];
  loading:boolean;
  parentUrl:string;

}

export default class Announcement extends React.Component<IAnnouncementProps, announcementState> {

  public constructor(props:IAnnouncementProps)
  {
    super(props);
    
    this.state =
    {
        anntItems:[],
      loading:false,
      parentUrl:"",
    };
  }
  

  public render(): React.ReactElement<IAnnouncementProps> {
    

    const renderAnnoucement = () =>
    this.state.anntItems.map(anntItems => (
      <div>
   
     <a href={this.state.parentUrl+anntItems.ID} target="_blank" data-interception="off" >
    <div className={"top-left"}>{anntItems.Title}
    
    </div>
    <span className={"LearMore"}><u>Learn more</u> &#8594;</span>
    <img src={JSON.parse(anntItems.Image).serverUrl+JSON.parse(anntItems.Image).serverRelativeUrl  } className={"imageAnnouncement"} />
    </a>
  </div>
    ));
    
    return (
     
      
      <div className="App">
     

      <Slider
        dots={true}
        slidesToShow={2}
        slidesToScroll={2}
        
        autoplay={true}    
       
      >
        {renderAnnoucement()}
      </Slider>
    </div>
    );

  }
  public componentDidMount()
  {
    //debugger;
    pnp.setup({
      sp: {
        baseUrl: this.props.webpartcontext.pageContext.web.absoluteUrl,
      },
    });
  
    SPComponentLoader.loadCss(this.props.webpartcontext.pageContext.web.absoluteUrl+"/Shared%20Documents/WITTecCSS/Announcement.css");
    SPComponentLoader.loadScript("https://code.jquery.com/jquery-1.11.0.min.js");
    SPComponentLoader.loadScript("https://code.jquery.com/jquery-migrate-1.2.1.min.js");
    SPComponentLoader.loadScript("https://cdn.jsdelivr.net/npm/slick-carousel@1.8.1/slick/slick.min.js");
   // SPComponentLoader.loadScript(this.props.context.pageContext.web.absoluteUrl+ "/Shared%20Documents/WITTecCSS/SlideJs.js");
   
   
   
    // this._getICons();
    this._getAnnouncement();
  }
  private _getAnnouncement():void
  {
    //alert(pnp.sp.web.lists.)
    pnp.sp.web.lists.getByTitle("Announcement").items.select("Title","Image","ImageUrl", "ID","OrderLink").orderBy("OrderLink", true).filter("Active eq 'Yes'").get().then
    ((Response)=>{
      let Announitems=Response.map(Announcementitem=>new ClassAnnouncement(Announcementitem));
      let sortAnnounitems= Announitems.sort((obj1, obj2)=> {
        // Ascending: first age less than the previous
        return obj1.OrderLink - obj2.OrderLink;
      });
       this.setState({anntItems:sortAnnounitems,loading:true,parentUrl:this.props.webpartcontext.pageContext.web.absoluteUrl+"/SitePages/Announcement.aspx?Itemid="});     
    }   
    );  
    
   
   
  } 
}
