import { broadcast } from '../connections/load';

// pencil_slider = document.getElementById('pencilSlider');
// pencil_slider.addEventListener('mouseup', changePencilSize)

interface point {
  x: number;
  y: number;
}

//! any 수정
let canvasContext: any;
// let points: any = [];
// const pathsry: any = [];
let color: any;
let cursorWidth: any;
let activeShape: any;
let eraserWidth: any;
let mouseDown: any = false;
let lastPoint: any;
let originPoint: any;
let force: any = 1;

//! msg: any 수정
export function actionPeerData(msg: any) {
  if (msg.event === 'draw') {
    draw(msg, null);
  } else if (msg.event === 'drawRect') {
    drawRect(msg, false, null);
  } else if (msg.event === 'clear') {
    // canvasContext.clearRect(0, 0, canvas.width, canvas.height);
  }
}

export function down(e: any) {
  // console.log('down');
  originPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  // points = [];
  // points.push(originPoint);
}

export function up(canvasContext: any) {
  // console.log('up');
  // pathsry.push(points);
  if (activeShape) {
    drawRect(activeShape, true, canvasContext);
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
    );
    activeShape = undefined;
  }
  lastPoint = undefined;
  originPoint = undefined;
}

export function move(
  e: any,
  canvasContext: any,
  activeTool: string,
  color: string,
  lineWidth: number,
  eraserWidth: number,
) {
  // console.log('move');

  mouseDown = e.buttons;
  if (e.buttons) {
    if (!lastPoint) {
      lastPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      originPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
      return;
    }

    if (activeTool === 'pencil') {
      draw(
        {
          lastPoint,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          force: force,
          color: color,
          lineWidth: lineWidth,
        },
        canvasContext,
      );

      broadcast(
        JSON.stringify({
          event: 'draw',
          lastPoint,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          force: force,
          color: color,
        }),
      );
    } else if (activeTool === 'rect') {
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
        canvasContext,
      );
      broadcast(
        JSON.stringify({
          event: 'drawRect',
          origin: origin,
          color: color,
          width: Math.abs(originPoint.x - e.nativeEvent.offsetX),
          height: Math.abs(originPoint.y - e.nativeEvent.offsetY),
        }),
      );
    } else if (activeTool === 'eraser') {
      console.log(eraserWidth);
      erase(
        {
          lastPoint,
          x: e.nativeEvent.offsetX,
          y: e.nativeEvent.offsetY,
          r: eraserWidth,
        },
        canvasContext,
      );
    }
    lastPoint = { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
  } else {
    lastPoint = undefined;
  }
}

//! msg: any 수정
export function draw(data: any, canvasContext: any) {
  // console.log('draw');
  canvasContext.lineCap = 'round';
  canvasContext.lineJoin = 'round';
  // points.push({ x: data.x, y: data.y });
  canvasContext.beginPath();
  canvasContext.moveTo(data.lastPoint.x, data.lastPoint.y);
  canvasContext.lineTo(data.x, data.y);
  canvasContext.strokeStyle = data.color;
  canvasContext.lineWidth = data.lineWidth;
  canvasContext.stroke();
  canvasContext.closePath();
}

//! msg: any 수정
export function drawRect(data: any, commit: any, canvasContext: any) {
  // activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
  if (data.commit || commit) {
    canvasContext.strokeStyle = data.color;
    canvasContext.strokeRect(
      data.origin.x,
      data.origin.y,
      data.width,
      data.height,
    );
  } else {
    // activeCtx.strokeStyle = data.color;
    // activeCtx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
  }
  activeShape = data;
}

export function erase(data: any, canvasContext: any) {
  // console.log('erase');
  const x = data.x;
  const y = data.y;
  const r = data.r / 2;
  for (let i = 0; i < Math.round(Math.PI * r); i++) {
    const angle = (i / Math.round(Math.PI * r)) * 360;
    canvasContext.clearRect(
      x,
      y,
      Math.sin(angle * (Math.PI / 180)) * r,
      Math.cos(angle * (Math.PI / 180)) * r,
    );
  }
}

export function key(e: any) {
  // console.log('key');
  // console.log(e);
  // if (e.key === 'Backspace') {
  //   canvasContext.clearRect(0, 0, canvas.width, canvas.height);
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

export function forceChanged(e: any) {
  force = e.webkitForce || 1;
}
