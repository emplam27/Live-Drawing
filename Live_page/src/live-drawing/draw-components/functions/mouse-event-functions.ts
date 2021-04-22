import { draw, erase } from './draw-functions';
import {
  DrawData,
  EraseData,
  Point,
  CanvasCtxTable,
} from '../../interfaces/draw-components-interfaces';

const agent = navigator.userAgent.toLowerCase();
const countDict = {};
let lastPoint: Point | null;
let isMoved = false;

function getTouchPos(canvas: HTMLCanvasElement, touchEvent: any): Point | null {
  if (!canvas || !touchEvent) return null;
  const rect = canvas.getBoundingClientRect();
  return {
    x: touchEvent.touches[0].clientX - rect.left,
    y: touchEvent.touches[0].clientY - rect.top,
    c: touchEvent.target.id,
  };
}

export function drawStart(ctx: CanvasRenderingContext2D, point: Point) {
  if (!ctx || !point) return;
  if (!countDict[point.c]) countDict[point.c] = 0;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  // lastPoint = point;
}

export function drawEnd(
  ctx: CanvasRenderingContext2D,
  point: Point,
  isMoved: boolean,
  activeTool: string,
) {
  if (!ctx || !point) return;
  // if (!isMoved ) {
  if (activeTool === 'pencil') {
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    ctx.closePath();
  }
}

//@ Mouse Event
export function mouseDown(
  e: any,
  canvasCtxTable: CanvasCtxTable,
  socket: SocketIOClient.Socket | null,
): void {
  if (!canvasCtxTable || !socket) return;
  lastPoint = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    c: e.target.id,
  };
  if (agent.indexOf('chrome') !== -1) e.preventDefault();
  isMoved = false;
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (!targetCanvasCtx || !lastPoint) return;
  drawStart(targetCanvasCtx, lastPoint);
  socket.emit('draw-start', {
    event: 'start',
    point: lastPoint,
    canvasId: targetCanvasId,
  });
}

export function mouseMove(
  e: any,
  activeTool: string,
  canvasCtxTable: CanvasCtxTable,
  color: string,
  eraserWidth: number,
  lineWidth: number,
  socket: SocketIOClient.Socket | null,
): void {
  if (!canvasCtxTable || !socket) return;

  if (!e.buttons) {
    lastPoint = null;
    return;
  }

  if (!lastPoint) {
    lastPoint = {
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
      c: e.target.id,
    };
    return;
  }

  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (!targetCanvasId || !targetCanvasCtx) return;

  const currentPoint: Point = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    c: e.target.id,
  };
  if (lastPoint.c !== currentPoint.c) return;
  if (!countDict[e.target.id]) countDict[e.target.id] = 0;
  isMoved = true;
  switch (activeTool) {
    case 'pencil':
      const drawData: DrawData = {
        event: 'pencil',
        canvasId: targetCanvasId,
        currentPoint: currentPoint,
        color: color,
        count: countDict[e.target.id],
        lastPoint: lastPoint,
        lineWidth: lineWidth,
      };
      draw(drawData, targetCanvasCtx);
      socket.emit('draw-pencil', drawData);
      countDict[e.target.id]++;
      break;

    case 'eraser':
      const eraserData: EraseData = {
        event: 'eraser',
        canvasId: targetCanvasId,
        currentPoint: currentPoint,
        r: eraserWidth,
      };
      erase(eraserData, targetCanvasCtx);
      socket.emit('draw-eraser', eraserData);
      break;
  }
  lastPoint = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    c: e.target.id,
  };
}

export function mouseUp(
  e: any,
  canvasCtxTable: CanvasCtxTable,
  socket: SocketIOClient.Socket | null,
  activeTool: string,
): void {
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (!lastPoint || !targetCanvasCtx) return;
  drawEnd(targetCanvasCtx, lastPoint, isMoved, activeTool);
  if (socket)
    socket.emit('draw-end', {
      event: 'end',
      canvasId: targetCanvasId,
      point: lastPoint,
      isMoved: isMoved,
      activeTool: activeTool,
    });
  lastPoint = null;
}

//@ Touch Event
export function touchStart(
  e: any,
  canvasCtxTable: CanvasCtxTable,
  socket: SocketIOClient.Socket | null,
): void {
  if (!canvasCtxTable || !socket) return;
  if (agent.indexOf('chrome') !== -1) e.preventDefault();
  isMoved = false;
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (!targetCanvasCtx) return;
  lastPoint = getTouchPos(targetCanvasCtx.canvas, e);
  if (!lastPoint) return;
  drawStart(targetCanvasCtx, lastPoint);
  socket.emit('draw-start', {
    event: 'start',
    point: lastPoint,
    canvasId: targetCanvasId,
  });
}

export function touchMove(
  e: any,
  activeTool: string,
  canvasCtxTable: CanvasCtxTable,
  color: string,
  eraserWidth: number,
  lineWidth: number,
  socket: SocketIOClient.Socket | null,
): void {
  if (!canvasCtxTable || !socket) return;
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];

  if (!targetCanvasId || !targetCanvasCtx) return;

  if (!lastPoint) {
    lastPoint = getTouchPos(targetCanvasCtx.canvas, e);
    return;
  }

  const currentPoint: Point | null = getTouchPos(targetCanvasCtx.canvas, e);
  if (!currentPoint || lastPoint.c !== currentPoint.c) return;
  if (!countDict[e.target.id]) countDict[e.target.id] = 0;
  isMoved = true;
  switch (activeTool) {
    case 'pencil':
      const drawData: DrawData = {
        event: 'pencil',
        canvasId: targetCanvasId,
        currentPoint: currentPoint,
        color: color,
        count: countDict[e.target.id],
        lastPoint: lastPoint,
        lineWidth: lineWidth,
      };
      draw(drawData, targetCanvasCtx);
      socket.emit('draw-pencil', drawData);
      countDict[e.target.id]++;
      break;

    case 'eraser':
      const eraserData: EraseData = {
        event: 'eraser',
        canvasId: targetCanvasId,
        currentPoint: currentPoint,
        r: eraserWidth,
      };
      erase(eraserData, targetCanvasCtx);
      socket.emit('draw-eraser', eraserData);
      break;
  }
  lastPoint = getTouchPos(targetCanvasCtx.canvas, e);
}

export function touchEnd(
  e: any,
  canvasCtxTable: CanvasCtxTable,
  socket: SocketIOClient.Socket | null,
  activeTool: string,
): void {
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (!lastPoint || !targetCanvasCtx) return;
  drawEnd(targetCanvasCtx, lastPoint, isMoved, activeTool);
  if (socket)
    socket.emit('draw-end', {
      event: 'end',
      canvasId: targetCanvasId,
      point: lastPoint,
      isMoved: isMoved,
      activeTool: activeTool,
    });
  lastPoint = null;
}

//@ HostMouseMove & HostTouchMove
// export function HostMouseMove(
//   e: any,
//   canvasCtxTable: CanvasCtxTable,
//   socket: SocketIOClient.Socket | null,
//   hostId: string | null,
// ): void {
//   e.stopPropagation();
//   const targetCanvasId = e.target.id;
//   const targetCanvasCtx = canvasCtxTable[targetCanvasId];
//   if (targetCanvasId !== hostId || !targetCanvasCtx) return;
//   const point = {
//     x: e.nativeEvent.offsetX,
//     y: e.nativeEvent.offsetY,
//     c: e.target.id,
//   };
//   if (socket)
//     socket.emit('host-move', { canvasId: targetCanvasId, point: point });
// }

// export function HostMouseMove(
//   e: any,
//   canvasCtxTable: CanvasCtxTable,
//   socket: SocketIOClient.Socket | null,
//   hostId: string | null,
// ): void {
//   const targetCanvasId = e.target.id;
//   const targetCanvasCtx = canvasCtxTable[targetCanvasId];
//   if (targetCanvasId !== hostId || !targetCanvasCtx) return;
//   const point = {
//     x: e.nativeEvent.offsetX,
//     y: e.nativeEvent.offsetY,
//     c: e.target.id,
//   };
//   if (socket)
//     socket.emit('host-move', { canvasId: targetCanvasId, point: point });
// }
