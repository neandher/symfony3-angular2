import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {ShowAuthedDirective} from "./directives/show-authed";
import {MessageAlertComponent} from "./layout/message-alert/message-alert.component";
import {PaginationComponent} from './pagination/pagination.component';
import { UserAvatarComponent } from './layout/user-avatar/user-avatar.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
  ],
  declarations: [
    ShowAuthedDirective,
    MessageAlertComponent,
    PaginationComponent,
    UserAvatarComponent,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule,
    ShowAuthedDirective,
    MessageAlertComponent,
    PaginationComponent,
    UserAvatarComponent,
  ]
})
export class SharedModule {

}
