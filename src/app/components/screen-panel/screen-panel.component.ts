import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Panel } from "src/app/interfaces";

@Component({
  selector: "app-screen-panel",
  templateUrl: "./screen-panel.component.html",
  styleUrls: ["./screen-panel.component.scss"]
})
export class ScreenPanelComponent {
  @Input() panel!: Panel;
  @Output() clicked = new EventEmitter();

  readonly PANEL_OFFSET_FACTOR = 3; // Pixels to visually offset panels

  handlePanelClick() {
    this.clicked.emit();
  }
}
