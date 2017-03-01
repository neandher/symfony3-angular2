import {NgModule} from "@angular/core";
import {Routes, RouterModule} from "@angular/router";

import {ChannelComponent} from "./channel.component";

const channelRoutes: Routes = [
  {
    path: '', component: ChannelComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(channelRoutes)],
  exports: [RouterModule]
})
export class ChannelRoutingModule { }
