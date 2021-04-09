import {
  DrawData,
  EraseData,
  Point,
} from '../../interfaces/draw-components-interfaces';

let count = 0;

function midPointBtw(p1: Point, p2: Point) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
}

export function draw(
  data: DrawData,
  canvasCtx: CanvasRenderingContext2D,
): void {
  count++;
  if (!canvasCtx) return;
  canvasCtx.lineCap = 'round';
  canvasCtx.lineJoin = 'round';
  const midPoint = midPointBtw(data.lastPoint, data.currentPoint);
  canvasCtx.quadraticCurveTo(
    data.lastPoint.x,
    data.lastPoint.y,
    midPoint.x,
    midPoint.y,
  );
  canvasCtx.strokeStyle = data.color;
  canvasCtx.lineWidth = data.lineWidth;
  if (count % 5 === 0) canvasCtx.stroke();
}

export function erase(
  data: EraseData,
  canvasCtx: CanvasRenderingContext2D,
): void {
  if (!canvasCtx) return;
  const x = data.currentPoint.x;
  const y = data.currentPoint.y;
  const r = data.r / 2;
  for (let i = 0; i < Math.round(Math.PI * r); i++) {
    const angle = (i / Math.round(Math.PI * r)) * 360;
    canvasCtx.clearRect(
      x,
      y,
      Math.sin(angle * (Math.PI / 180)) * r,
      Math.cos(angle * (Math.PI / 180)) * r,
    );
  }
}
