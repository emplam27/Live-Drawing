import React from 'react';

import {
  mouseDown,
  mouseMove,
  mouseUp,
  touchStart,
  touchMove,
  touchEnd,
} from '../functions/mouse-event-functions';

import { DrawableCanvasComponentProps } from '../interfaces/drawable-canvas-component';

function DrawableCanvasComponent(props: DrawableCanvasComponentProps) {
  return (
    <>
      <canvas
        id={props.canvasId}
        className={`${props.displayHidden ? 'hidden' : 'z-10'}`}
        width={(window.innerWidth - 60) * 0.5}
        height={window.innerHeight}
        onMouseDown={(e) => mouseDown(e, props.canvasCtxTable, props.socket)}
        onTouchStart={(e) => touchStart(e, props.canvasCtxTable)}
        onMouseUp={(e) => mouseUp(e, props.canvasCtxTable)}
        onTouchEnd={(e) => touchEnd(e, props.canvasCtxTable)}
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
        onTouchMove={(e) =>
          touchMove(
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