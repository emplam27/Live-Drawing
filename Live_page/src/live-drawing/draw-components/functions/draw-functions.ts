import {
  DrawData,
  EraseData,
  Point,
} from '../../interfaces/draw-components-interfaces';

function midPointBtw1(p1: Point, p2: Point) {
  return {
    x: p1.x + (p2.x - p1.x) / 3,
    y: p1.y + (p2.y - p1.y) / 3,
  };
}
function midPointBtw(p1: Point, p2: Point) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
}

function midPointBtw2(p1: Point, p2: Point) {
  return {
    x: p1.x + ((p2.x - p1.x) / 3) * 2,
    y: p1.y + ((p2.y - p1.y) / 3) * 2,
  };
}

export function draw(
  data: DrawData,
  canvasCtx: CanvasRenderingContext2D,
): void {
  if (!canvasCtx) return;
  canvasCtx.lineCap = 'round';
  canvasCtx.lineJoin = 'round';
  // if (data.count % 2 === 1) {
  //   canvasCtx.beginPath();
  //   canvasCtx.moveTo(data.lastPoint.x, data.lastPoint.y);
  // }
  if (!canvasCtx) return;
  canvasCtx.lineCap = 'round';
  canvasCtx.lineJoin = 'round';
  canvasCtx.beginPath();
  canvasCtx.moveTo(data.lastPoint.x, data.lastPoint.y);
  const midPoint = midPointBtw(data.lastPoint, data.currentPoint);
  canvasCtx.quadraticCurveTo(
    midPoint.x,
    midPoint.y,
    data.currentPoint.x,
    data.currentPoint.y,
  );
  canvasCtx.strokeStyle = data.color;
  canvasCtx.lineWidth = data.lineWidth;
  canvasCtx.stroke();
  canvasCtx.closePath();
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
