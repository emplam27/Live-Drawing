import { DrawData, EraseData, Point } from './draw-interfaces';
import { PeerConnectionContext } from '../interfaces/index-interfaces';
import { Layer } from '../interfaces/layer-interfaces';
import { Data } from '../../interfaces/app-interfaces';

let lastPoint: Point | null;

export function actionDrawHistory(
  message: any,
  canvas: any,
  peerConnectionContext: any,
): void {
  // console.log('========== actionDrawHistory ==========');
  canvas.loadFromJSON(message.canvas);
  canvas.historyNextState = message.historyNextState;
  canvas.historyRedo = message.historyRedo;
  canvas.historyUndo = message.historyUndo;
  peerConnectionContext.is_new = false;
}

export function broadcast(
  data: string,
  peerConnectionContext: PeerConnectionContext,
): void {
  for (const peerId in peerConnectionContext.channels) {
    if (peerConnectionContext.channels[peerId].readyState === 'open') {
      peerConnectionContext.channels[peerId].send(data);
    }
  }
}

export function mouseDown(
  // e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  e: any,
): void {
  // console.log('down');
  lastPoint = {
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY,
    c: e.target.id,
  };
  // points = [];
  // points.push(originPoint);
}

export function mouseMove(
  e: any,
  activeTool: string,
  color: string,
  lineWidth: number,
  eraserWidth: number,
  canvasCtxTable: any,
  socket: SocketIOClient.Socket | null,
  data: Data,
  // drawHistory: DrawData[],
  // setDrawHistory: React.Dispatch<React.SetStateAction<DrawData[]>>,
): void {
  // console.log('move');
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

  if (data.hostId !== data.userId && e.target.id !== data.userId) return;
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
      // console.log('mouseMove :: pencil');
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
      // broadcast(JSON.stringify(drawData), peerConnectionContext);
      // setDrawHistory([...drawHistory, data]);
      break;

    case 'eraser':
      const eraserData = {
        event: 'eraser',
        canvasId: targetCanvasId,
        currentPoint: currentPoint,
        r: eraserWidth,
      };
      erase(eraserData, targetCanvasCtx);
      socket.emit('draw-eraser', eraserData);
      // broadcast(JSON.stringify(eraserData), peerConnectionContext);
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

export function draw(data: DrawData, canvasCtx: any): void {
  // console.log('draw');
  if (data.lastPoint.c !== data.currentPoint.c) return;
  canvasCtx.lineCap = 'round';
  canvasCtx.lineJoin = 'round';
  // points.push({ x: data.x, y: data.y });
  canvasCtx.beginPath();
  canvasCtx.moveTo(data.lastPoint.x, data.lastPoint.y);
  canvasCtx.lineTo(data.currentPoint.x, data.currentPoint.y);
  canvasCtx.strokeStyle = data.color;
  canvasCtx.lineWidth = data.lineWidth;
  canvasCtx.stroke();
  canvasCtx.closePath();
}

export function erase(data: EraseData, canvasCtx: any): void {
  // console.log('erase');
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

// export function key(e: any): void {
// console.log('key');
// console.log(e);
// if (e.key === 'Backspace') {
//   canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
//   broadcast(
//     JSON.stringify({
//       event: 'clear',
//     })
//   );
// }
// if (e.key === 'ArrowRight') {
//   colorIndex++;
// }
// if (e.key === 'ArrowLeft') {
//   colorIndex--;
// }
// if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
//   if (colorIndex >= colorMap.length) {
//     colorIndex = 0;
//   }
//   if (colorIndex < 0) {
//     colorIndex = colorMap.length - 1;
//   }
//   if (colorElements[color]) {
//     colorElements[color].classList.remove('active');
//   }
//   color = colorMap[colorIndex];
//   colorPicker.dataset.color = color;
//   colorPicker.style.color = color;
//   colorElements[color].classList.toggle('active');
// }
// if (
//   mouseDown &&
//   (e.key === 'ArrowUp' ||
//     (e.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)))
// ) {
//   force += 0.025;
// }
// if (
//   mouseDown &&
//   (e.key === 'ArrowDown' ||
//     (e.altKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)))
// ) {
//   force -= 0.025;
// }
// }

// export function forceChanged(e: any): void {
//   force = e.webkitForce || 1;
// }
