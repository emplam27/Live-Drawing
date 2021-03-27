import {
  DrawData,
  EraseData,
  Point,
  RectData,
} from '../pages/draw/interfaces/draw-interfaces';
import { PeerConnectionContext } from '../pages/draw/interfaces/index-interfaces';
import { Layer } from '../pages/draw/interfaces/layer-interfaces';

// let points: any = [];
// const pathsry: any = [];
let activeShape: RectData | null;
let lastPoint: Point | null;
let originPoint: Point | null;
let force: number;
force = 1;

export function actionDrawHistory(drawHistory: any, canvasCtxTable: any): void {
  // console.log('========== actionDrawHistory ==========');
  drawHistory.forEach((data: any) => {
    // TODO: 들어온 이벤트에 맞는 캔버스에 그려야함
    if (data.event === 'draw') {
      draw(data, canvasCtxTable[data.canvasId]);
    }
    //! 이벤트 종류 추가해야 함
  });
}

export function broadcast(
  data: string,
  peerConnectionContext: PeerConnectionContext,
): void {
  for (const peerId in peerConnectionContext.channels) {
    // peerConnectionContext.channels[peerId].send(data);
    if (peerConnectionContext.channels[peerId].readyState === 'open') {
      peerConnectionContext.channels[peerId].send(data);
    }
  }
}

export function draw(
  data: DrawData,
  canvasCtx: CanvasRenderingContext2D,
): void {
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

export function drawRect(
  data: RectData,
  commit: boolean,
  canvasCtx: CanvasRenderingContext2D,
): void {
  // activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
  if (data.commit || commit) {
    canvasCtx.strokeStyle = data.color;
    canvasCtx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
  } else {
    // activeCtx.strokeStyle = data.color;
    // activeCtx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
  }
  activeShape = data;
}

export function erase(
  data: EraseData,
  canvasCtx: CanvasRenderingContext2D,
): void {
  // console.log('erase');
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

export function mouseDown(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
): void {
  // console.log('down');
  originPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  // points = [];
  // points.push(originPoint);
}

export function mouseUp(
  canvasCtx: CanvasRenderingContext2D | null,
  peerConnectionContext: PeerConnectionContext,
  drawHistory: DrawData[],
  setDrawHistory: React.Dispatch<React.SetStateAction<DrawData[]>>,
): void {
  // console.log('up');
  // pathsry.push(points);
  if (activeShape && canvasCtx !== null) {
    drawRect(activeShape, true, canvasCtx);
    broadcast(
      JSON.stringify(
        Object.assign(
          {
            event: 'drawRect',
            commit: true,
          },
          activeShape,
        ),
      ),
      peerConnectionContext,
    );
    activeShape = null;
  }
  lastPoint = null;
  originPoint = null;
}

export function mouseMove(
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  activeLayer: Layer | null,
  activeTool: string,
  color: string,
  lineWidth: number,
  eraserWidth: number,
  peerConnectionContext: PeerConnectionContext,
  drawHistory: DrawData[],
  setDrawHistory: React.Dispatch<React.SetStateAction<DrawData[]>>,
): void {
  // console.log('move');
  if (!activeLayer || !activeLayer.canvasCtx) return;

  if (e.buttons) {
    if (!lastPoint) {
      lastPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      originPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      return;
    }

    if (activeTool === 'pencil') {
      const data = {
        event: 'draw',
        canvasId: activeLayer.canvasId,
        lastPoint,
        x: e.nativeEvent.offsetX,
        y: e.nativeEvent.offsetY,
        force: force,
        color: color,
        lineWidth: lineWidth,
      };
      draw(data, activeLayer.canvasCtx);
      broadcast(JSON.stringify(data), peerConnectionContext);
      setDrawHistory([...drawHistory, data]);
    } else if (activeTool === 'rect' && originPoint) {
      const origin = {
        x: Math.min(originPoint.x, e.nativeEvent.offsetX),
        y: Math.min(originPoint.y, e.nativeEvent.offsetY),
      };
      drawRect(
        {
          origin: origin,
          color: color,
          width: Math.abs(originPoint.x - e.nativeEvent.offsetX),
          height: Math.abs(originPoint.y - e.nativeEvent.offsetY),
        },
        false,
        activeLayer.canvasCtx,
      );
      broadcast(
        JSON.stringify({
          event: 'drawRect',
          origin: origin,
          color: color,
          width: Math.abs(originPoint.x - e.nativeEvent.offsetX),
          height: Math.abs(originPoint.y - e.nativeEvent.offsetY),
        }),
        peerConnectionContext,
      );
    } else if (activeTool === 'eraser') {
      // console.log(eraserWidth);
      erase(
        {
          lastPoint,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          r: eraserWidth,
        },
        activeLayer.canvasCtx,
      );
    }
    lastPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  } else {
    lastPoint = null;
  }
}

export function key(e: any): void {
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
}

export function forceChanged(e: any): void {
  force = e.webkitForce || 1;
}
