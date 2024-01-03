import { animate, state, style, transition, trigger } from "@angular/animations";
import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from "@angular/core";
import { Cache } from "src/app/decorators/cache.decorator";
import { ZIndexOrder } from "src/app/enums";
import { Panel } from "src/app/interfaces";
import { ImageSliceService } from "src/app/services/image-slice.service";

@Component({
  selector: "app-stage",
  templateUrl: "./stage.component.html",
  styleUrls: ["./stage.component.scss"],
  animations: [
    trigger("panelMovement", [
      state("left", style({ transform: "translateX(-{{ offsetFactorTranslate }}%)" }), {
        params: { offsetFactorTranslate: "100" }
      }),
      state("right", style({ transform: "translateX({{ offsetFactorTranslate }}%)" }), {
        params: { offsetFactorTranslate: "100" }
      }),
      transition(
        "left => start, right => start",
        [animate("{{ offsetFactorTiming }}ms ease-in-out", style({ transform: "translateX(0)" }))],
        {
          params: { offsetFactorTiming: "500" }
        }
      ),
      transition(
        "start => left, start => right",
        [style({ transform: "translateX(0)" }), animate("{{ offsetFactorTiming }}ms ease-in-out")],
        {
          params: { offsetFactorTiming: "500" }
        }
      )
    ])
  ]
})
export class StageComponent implements AfterViewInit {
  @ViewChild("sourceImage", { static: false }) sourceImageRef!: ElementRef;
  panelList: Panel[] = [];
  animationStateList: string[] = [];

  private readonly NUM_PANELS = 10;
  private readonly zIndexOrder: ZIndexOrder = ZIndexOrder.ASCENDING;
  public readonly BASE_TRANSLATE_PERCENTAGE = 100;
  public readonly BASE_TIMING_MS = 500;
  stageWidth!: number;

  constructor(
    private imageSliceService: ImageSliceService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    // Wait for the image to be fully loaded
    const sourceImage = this.sourceImageRef.nativeElement;
    this.renderer.listen(sourceImage, "load", () => {
      this.panelList = this.initPanelList(sourceImage);
      this.stageWidth = sourceImage.width;
      this.resetAnimationStateList();
    });
  }

  @Cache()
  calculateAnimationOffsetFactor(index: number): number {
    // Leftmost should be 100%
    // Rightmost should be 100%
    // [0,middleLeft] should be (index+1) * 100%
    // [middleRight,end] should be (index-middleLeft) * 100%
    const indexMiddleRight: number = Math.floor(this.NUM_PANELS / 2);
    const indexMiddleLeft: number = indexMiddleRight - 1;
    if (index <= indexMiddleLeft) {
      return index + 1;
    } else {
      return this.NUM_PANELS - index;
    }
  }

  @Cache()
  abs(val: number): number {
    return Math.abs(val);
  }

  initPanelList(sourceImage: any): Panel[] {
    const canvasList = this.imageSliceService.sliceImage(sourceImage, this.NUM_PANELS);

    /**
     * Panels are all offset so they can stack off-stage. Middle 2 panels should be nearest/farthest from the viewer
     * Num panels must be even (for left and right halfs), and at least 2
     * indexMiddleRight = Math.floor(NUM_PANELS / 2)
     * indexMiddleLeft = indexMiddleRight - 1
     *
     * indexMiddle[left/right] Z indices will always be 0.
     * [Left/Right]most will always have greatest Math.abs() value === (NUM_PANELS / 2) - 1
     * ^^(-2)^^--(-1)--__(0)__ __(0)__--(-1)--^^(-2)^^      __2__--1--^^0^^ ^^0^^--1--__2__
     */

    const indexMiddleRight: number = Math.floor(this.NUM_PANELS / 2);
    const indexMiddleLeft: number = indexMiddleRight - 1;

    return canvasList.map((canvas: HTMLCanvasElement, index: number) => {
      let zIndex: number;
      if (index === indexMiddleLeft || index === indexMiddleRight) {
        zIndex = 0;
      } else if (index < indexMiddleLeft) {
        zIndex = indexMiddleLeft - index;
      } else {
        zIndex = index - indexMiddleRight;
      }

      zIndex *= this.zIndexOrder === ZIndexOrder.ASCENDING ? +1 : -1;

      return {
        height: canvas.height,
        width: canvas.width,
        zIndex,
        dataUrl: canvas.toDataURL()
      };
    });
  }

  handlePanelClick(index: number) {
    const indexMiddleRight: number = Math.floor(this.NUM_PANELS / 2);
    const indexMiddleLeft: number = indexMiddleRight - 1;
    const currentState = this.animationStateList[index];
    let nextState = "start";

    if (index <= indexMiddleLeft) {
      switch (currentState) {
        case "start":
          nextState = "left";
          break;
        case "left":
          nextState = "start";
          break;
      }
    } else if (index >= indexMiddleRight) {
      switch (currentState) {
        case "start":
          nextState = "right";
          break;
        case "right":
          nextState = "start";
          break;
      }
    }

    this.animationStateList[index] = nextState;
  }

  resetAnimationStateList(): void {
    this.animationStateList = Array(this.NUM_PANELS).fill("start");
  }

  /**
   * Use css to translate panel to left until it completely overlaps the next one, then remove the image source from the original panel and replace the overlapped panel with the overlapping panel's source.
   * Repeat until all panels are gone
   */
}
