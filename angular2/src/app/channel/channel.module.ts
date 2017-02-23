import {NgModule, ModuleWithProviders} from '@angular/core';
import {SharedModule} from "../shared/shared.module";
import {RouterModule} from "@angular/router";
import {ChannelComponent} from "./channel.component";
import {AuthGuard} from "../shared/services/auth.guard";

const ChannelRouting: ModuleWithProviders = RouterModule.forChild([
  {path: '', component: ChannelComponent, canActivate: [AuthGuard]},
]);

@NgModule({
  imports: [
    SharedModule,
    ChannelRouting
  ],
  declarations: [
    ChannelComponent
  ]
})
export class ChannelModule { }
