export interface Point {
  x: number;
  y: number;
}

export interface DrawData extends Point {
  lastPoint: Point;
  color: string;
  lineWidth: number;
  force: number;
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
