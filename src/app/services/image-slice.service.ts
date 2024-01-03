import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ImageSliceService {
  sliceImage(image: HTMLImageElement, numSlices: number): HTMLCanvasElement[] {
    const sliceWidth = image.width / numSlices;
    const canvasList: HTMLCanvasElement[] = [];

    for (let i = 0; i < numSlices; i++) {
      const canvas = document.createElement("canvas");
      canvas.width = sliceWidth;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(image, i * sliceWidth, 0, sliceWidth, image.height, 0, 0, sliceWidth, image.height);

      canvasList.push(canvas);
    }

    return canvasList;
  }
}
