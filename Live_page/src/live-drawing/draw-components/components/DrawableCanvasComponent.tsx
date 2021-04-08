import React from 'react';

import {
  mouseDown,
  mouseMove,
  mouseUp,
} from '../functions/mouse-event-functions';

import { DrawableCanvasComponentProps } from '../interfaces/drawable-canvas-component';

function DrawableCanvasComponent(props: DrawableCanvasComponentProps) {
  return (
    <>
      <canvas
        key={props.canvasId}
        id={props.canvasId}
        width={(window.innerWidth - 60) * 0.5}
        height={window.innerHeight}
        onMouseDown={(e) => mouseDown(e)}
        onMouseUp={mouseUp}
        onMouseMove={(e) =>
          mouseMove(
            e,
            props.activeTool,
            props.canvasCtxTable,
            props.color,
            props.eraserWidth,
            props.lineWidth,
            props.roomInfo,
            props.socket,
          )
        }
      />
    </>
  );
}

export default DrawableCanvasComponent;
