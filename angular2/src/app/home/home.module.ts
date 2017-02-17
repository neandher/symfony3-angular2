import {NgModule, ModuleWithProviders} from "@angular/core";
import {RouterModule} from "@angular/router";
import {HomeComponent} from "./home.component";
import {SharedModule} from "../shared/shared.module";

const homeRouting: ModuleWithProviders = RouterModule.forChild([
  {path: '', component: HomeComponent},
]);

@NgModule({
  imports: [
    homeRouting,
    SharedModule
  ],
  declarations: [
    HomeComponent
  ],
  exports: []
})
export class HomeModule {
}
