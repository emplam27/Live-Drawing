export interface Point {
  x: number;
  y: number;
}

export interface DrawData {
  event: string;
  canvasId: string;
  lastPoint: Point;
  currentPoint: Point;
  color: string;
  lineWidth: number;
}

export interface EraseData {
  event: string;
  canvasId: string;
  currentPoint: Point;
  r: number;
}

export interface RectData {
  color: string;
  origin: Point;
  width: number;
  height: number;
  commit?: boolean;
}
