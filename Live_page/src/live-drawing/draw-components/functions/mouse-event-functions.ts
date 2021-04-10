import { draw, erase } from './draw-functions';

import {
  DrawData,
  EraseData,
  Point,
  CanvasCtxTable,
} from '../../interfaces/draw-components-interfaces';
import { RoomInfo } from '../../interfaces/socket-interfaces';

let lastPoint: Point | null;

export function mouseDown(e: any): void {
  lastPoint = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    c: e.target.id,
  };
}

export function mouseMove(
  e: any,
  activeTool: string,
  canvasCtxTable: CanvasCtxTable,
  color: string,
  eraserWidth: number,
  lineWidth: number,
  roomInfo: RoomInfo,
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
  switch (activeTool) {
    case 'pencil':
      const drawData: DrawData = {
        event: 'pencil',
        canvasId: targetCanvasId,
        lastPoint: lastPoint,
        currentPoint: currentPoint,
        color: color,
        lineWidth: lineWidth,
      };
      draw(drawData, targetCanvasCtx);
      socket.emit('draw-pencil', drawData);
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

export function mouseUp(): void {
  lastPoint = null;
}
