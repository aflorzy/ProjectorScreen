import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ScreenPanelComponent } from "./components/screen-panel/screen-panel.component";
import { StageComponent } from "./components/stage/stage.component";

@NgModule({
  declarations: [AppComponent, ScreenPanelComponent, StageComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
