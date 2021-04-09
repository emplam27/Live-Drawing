import {
  CanvasCtxTable,
  DrawData,
  EraseData,
  Point,
} from '../../interfaces/draw-components-interfaces';

const points: { [c: string]: (DrawData | EraseData)[][] } = {};

function midPointBtw(p1: Point, p2: Point) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2,
  };
}

export function setStart(data: DrawData | EraseData) {
  if (!points[data.currentPoint.c]) points[data.currentPoint.c] = [[data]];
  else points[data.currentPoint.c].push([data]);
}

export function draw(
  data: DrawData | EraseData,
  canvasCtx: CanvasRenderingContext2D,
): void {
  if (!canvasCtx || !points[data.currentPoint.c]) return;
  canvasCtx.lineCap = 'round';
  canvasCtx.lineJoin = 'round';
  canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
  const pointsLength = points[data.currentPoint.c].length;
  points[data.currentPoint.c][pointsLength - 1].push(data);
  for (let k = 0; k < pointsLength; k++) {
    if (points[data.currentPoint.c][k][0].event === 'pencil') {
      canvasCtx.beginPath();
      let p1 = (points[data.currentPoint.c][k][0] as DrawData).lastPoint;
      let p2 = points[data.currentPoint.c][k][0].currentPoint;
      // let p1: Point, p2: Point;
      if (p1) canvasCtx.moveTo(p1.x, p1.y);
      for (let i = 1; i < points[data.currentPoint.c][k].length; i++) {
        p1 = (points[data.currentPoint.c][k][i] as DrawData).lastPoint;
        p2 = points[data.currentPoint.c][k][i].currentPoint;
        const midPoint = midPointBtw(p1, p2);
        if (p1 && midPoint)
          canvasCtx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
      }
      canvasCtx.strokeStyle = (points[data.currentPoint.c][
        k
      ][0] as DrawData).color;
      canvasCtx.lineWidth = (points[data.currentPoint.c][
        k
      ][0] as DrawData).lineWidth;
      // if (data.count % 3 === 0)
      if (p2) canvasCtx.lineTo(p2.x, p2.y);
      canvasCtx.stroke();
    } else if (points[data.currentPoint.c][k][0].event === 'eraser') {
      for (let i = 0; i < points[data.currentPoint.c][k].length; i++) {
        const currentEraserPoint = points[data.currentPoint.c][k][i];
        erase(currentEraserPoint as EraseData, canvasCtx);
      }
    }
  }
}

export function erase(
  data: EraseData,
  canvasCtx: CanvasRenderingContext2D,
): void {
  if (!canvasCtx || !data.currentPoint) return;
  const x = data.currentPoint.x;
  const y = data.currentPoint.y;
  const r = data.r;
  canvasCtx.clearRect(x - r, y - r, 2 * r, 2 * r);
  // const r = data.r / 2;
  // for (let i = 0; i < Math.round(Math.PI * r); i++) {
  //   const angle = (i / Math.round(Math.PI * r)) * 360;
  //   canvasCtx.clearRect(
  //     x,
  //     y,
  //     Math.sin(angle * (Math.PI / 180)) * r,
  //     Math.cos(angle * (Math.PI / 180)) * r,
  //   );
  // }
}
