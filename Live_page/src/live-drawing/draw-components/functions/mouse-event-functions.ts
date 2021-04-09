import {
  DrawData,
  EraseData,
  Point,
  CanvasCtxTable,
} from '../../interfaces/draw-components-interfaces';
import { draw, erase } from './draw-functions';
import { RoomInfo } from '../../interfaces/socket-interfaces';

let lastPoint: Point | null;
let count = 0;

export function mouseDown(e: any, canvasCtxTable: CanvasCtxTable): void {
  if (!canvasCtxTable) return;
  lastPoint = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    c: e.target.id,
  };
  count = 0;
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  targetCanvasCtx.beginPath();
  targetCanvasCtx.moveTo(lastPoint.x, lastPoint.y);
}

export function mouseMove(
  e: any,
  activeTool: string,
  color: string,
  lineWidth: number,
  eraserWidth: number,
  canvasCtxTable: CanvasCtxTable,
  socket: SocketIOClient.Socket | null,
  roomInfo: RoomInfo,
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

  // 호스트가 아니면 다른 레이어에 접근 금지
  if (
    roomInfo.roomHostId !== roomInfo.userId &&
    e.target.id !== roomInfo.userId
  )
    return;

  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (!targetCanvasId || !targetCanvasCtx) return;

  const currentPoint: Point = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    c: e.target.id,
  };
  if (lastPoint.c !== currentPoint.c) return;
  switch (activeTool) {
    case 'pencil':
      const drawData: DrawData = {
        event: 'pencil',
        canvasId: targetCanvasId,
        currentPoint: currentPoint,
        color: color,
        count: count,
        lastPoint: lastPoint,
        lineWidth: lineWidth,
      };
      draw(drawData, targetCanvasCtx);
      socket.emit('draw-pencil', drawData);
      count++;
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

export function mouseUp(e: any, canvasCtxTable: CanvasCtxTable): void {
  const targetCanvasId = e.target.id;
  const targetCanvasCtx = canvasCtxTable[targetCanvasId];
  if (lastPoint) targetCanvasCtx.lineTo(lastPoint.x, lastPoint.y);
  targetCanvasCtx.closePath();
  lastPoint = null;
}
