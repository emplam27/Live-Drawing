import React from 'react';

import ToolbarComponent from './ToolbarComponent';
import '../index.css';

import { MyLayerComponentProps } from '../interfaces/my-layer-interfaces';

import {
  mouseDown,
  mouseMove,
  mouseUp,
} from '../functions/mouse-event-functions';

function MyLayerComponent(props: MyLayerComponentProps) {
  return (
    <>
      <canvas
        key={props.roomInfo.userId}
        id={props.roomInfo.userId}
        className={'border-2 border-indigo-600'}
        width={(window.innerWidth - 60) * 0.5}
        height={window.innerHeight}
        onMouseDown={(e) => mouseDown(e)}
        onMouseUp={mouseUp}
        onMouseMove={(e) =>
          mouseMove(
            e,
            props.activeTool,
            props.color,
            props.lineWidth,
            props.eraserWidth,
            props.canvasCtxTable,
            props.socket,
            props.roomInfo,
          )
        }
      />
      <ToolbarComponent
        activeTool={props.activeTool}
        color={props.color}
        cursorWidth={props.cursorWidth}
        eraserWidth={props.eraserWidth}
        lineWidth={props.lineWidth}
        setActiveTool={props.setActiveTool}
        setColor={props.setColor}
        setCursorWidth={props.setCursorWidth}
        setEraserWidth={props.setEraserWidth}
        setLineWidth={props.setLineWidth}
      />
    </>
  );
}

export default MyLayerComponent;
