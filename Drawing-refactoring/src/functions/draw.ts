import { DrawData, EraseData, Point, RectData } from './draw-interfaces';
import { PeerConnectionContext } from '../draw/interfaces/index-interfaces';
import { Layer } from '../draw/interfaces/layer-interfaces';
// import { Layer } from '../pages/draw/interfaces/canvas-interfaces';

let lastPoint: Point | null;
let originPoint: Point | null;

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
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
): void {
  // console.log('down');
  originPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  // points = [];
  // points.push(originPoint);
}

export function mouseMove(
  e: any,
  activeLayer: Layer | null,
  activeTool: string,
  color: string,
  lineWidth: number,
  eraserWidth: number,
  // peerConnectionContext: PeerConnectionContext,
  // drawHistory: DrawData[],
  // setDrawHistory: React.Dispatch<React.SetStateAction<DrawData[]>>,
): void {
  // console.log('move');
  if (!activeLayer || !activeLayer.canvasCtx) return;

  if (!e.buttons) {
    lastPoint = null;
    return;
  }

  if (!lastPoint) {
    lastPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    originPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
    return;
  }

  switch (activeTool) {
    case 'pencil':
      const data = {
        event: 'draw',
        canvasId: activeLayer.canvasId,
        lastPoint: lastPoint,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        color: color,
        lineWidth: lineWidth,
      };
      draw(data, activeLayer.canvasCtx);
      // broadcast(JSON.stringify(data), peerConnectionContext);
      // setDrawHistory([...drawHistory, data]);
      break;
    case 'eraser':
      erase(
        {
          lastPoint,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          r: eraserWidth,
        },
        activeLayer.canvasCtx,
      );
      break;
  }
  lastPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
}

export function mouseUp(
  canvasCtx: any | null,
  peerConnectionContext: PeerConnectionContext,
  drawHistory: DrawData[],
  setDrawHistory: React.Dispatch<React.SetStateAction<DrawData[]>>,
): void {
  lastPoint = null;
  originPoint = null;
}

export function draw(data: DrawData, canvasCtx: any): void {
  // console.log(canvasCtxs);
  // console.log('draw');
  canvasCtx.lineCap = 'round';
  canvasCtx.lineJoin = 'round';
  // points.push({ x: data.x, y: data.y });
  canvasCtx.beginPath();
  canvasCtx.moveTo(data.lastPoint.x, data.lastPoint.y);
  canvasCtx.lineTo(data.x, data.y);
  canvasCtx.strokeStyle = data.color;
  canvasCtx.lineWidth = data.lineWidth;
  canvasCtx.stroke();
  canvasCtx.closePath();
}

export function erase(data: EraseData, canvasCtx: any): void {
  console.log('erase');
  const x = data.x;
  const y = data.y;
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
