import {NgModule} from '@angular/core';

import {SharedModule} from "../shared/shared.module";
import {ChannelComponent} from "./channel.component";
import {ChannelRoutingModule} from "./channel.routing.module";


@NgModule({
  imports: [
    SharedModule,
    ChannelRoutingModule
  ],
  declarations: [
    ChannelComponent
  ]
})
export class ChannelModule { }
