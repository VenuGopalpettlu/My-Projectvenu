import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'NavAnnouncementWebPartStrings';
import NavAnnouncement from './components/NavAnnouncement';
import { INavAnnouncementProps } from './components/INavAnnouncementProps';

export interface INavAnnouncementWebPartProps {
  description: string;
}

export default class NavAnnouncementWebPart extends BaseClientSideWebPart<INavAnnouncementWebPartProps> {

  public render(): void {
    const element: React.ReactElement<INavAnnouncementProps> = React.createElement(
      NavAnnouncement,
      {
        description: this.properties.description,
        webpartcontext:this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

 

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
