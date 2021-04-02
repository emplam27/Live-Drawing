export interface Point {
  x: number;
  y: number;
}

export interface DrawData extends Point {
  event: string;
  canvasId: string;
  lastPoint: Point;
  x: number;
  y: number;
  color: string;
  lineWidth: number;
}

export interface EraseData extends Point {
  r: number;
  lastPoint: Point;
}

export interface RectData {
  color: string;
  origin: Point;
  width: number;
  height: number;
  commit?: boolean;
}
