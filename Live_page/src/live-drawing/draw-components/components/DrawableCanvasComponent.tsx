import React from 'react';
import {
  onMouseEnter,
  onMouseLeave,
  onMouseMove,
  onTouchMove,
} from '../functions/cursor-functions';

import {
  mouseDown,
  mouseMove,
  mouseUp,
  touchStart,
  touchMove,
  touchEnd,
  HostMouseMove,
  HostTouchMove,
} from '../functions/mouse-event-functions';
import { DrawableCanvasComponentProps } from '../interfaces/drawable-canvas-component';

function DrawableCanvasComponent(props: DrawableCanvasComponentProps) {
  return (
    <canvas
      id={props.canvasId}
      className={props.displayHidden ? 'hidden' : ''}
      width={(window.innerWidth - 60) * 0.5}
      height={window.innerHeight}
      onMouseDown={(e) => mouseDown(e, props.canvasCtxTable, props.socket)}
      onTouchStart={(e) => touchStart(e, props.canvasCtxTable, props.socket)}
      onMouseUp={(e) => mouseUp(e, props.canvasCtxTable, props.socket)}
      onTouchEnd={(e) => touchEnd(e, props.canvasCtxTable, props.socket)}
      onMouseMove={(e) => {
        onMouseMove(e, props.setPosition);
        mouseMove(
          e,
          props.activeTool,
          props.canvasCtxTable,
          props.color,
          props.eraserWidth,
          props.lineWidth,
          props.roomInfo,
          props.socket,
        );
        HostMouseMove(
          e,
          props.canvasCtxTable,
          props.socket,
          props.roomInfo.roomHostId,
        );
      }}
      onTouchMove={(e) => {
        onTouchMove(e, props.setPosition);
        touchMove(
          e,
          props.activeTool,
          props.canvasCtxTable,
          props.color,
          props.eraserWidth,
          props.lineWidth,
          props.roomInfo,
          props.socket,
        );
        HostTouchMove(
          e,
          props.canvasCtxTable,
          props.socket,
          props.roomInfo.roomHostId,
        );
      }}
      onMouseEnter={() => onMouseEnter(props.setHidden)}
      onMouseLeave={() => onMouseLeave(props.setHidden)}
    />
  );
}

export default DrawableCanvasComponent;
