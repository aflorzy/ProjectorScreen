import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ScreenPanelComponent } from "./screen-panel.component";

describe("ScreenPanelComponent", () => {
  let component: ScreenPanelComponent;
  let fixture: ComponentFixture<ScreenPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScreenPanelComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ScreenPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
