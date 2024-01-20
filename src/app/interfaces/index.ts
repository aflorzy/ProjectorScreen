export interface Panel {
  height: number;
  width: number;
  zIndex: number;
  dataUrl: string;
}

export interface ElemPosition {
  left: number;
  top: number;
  right?: number;
  bottom?: number;
}
