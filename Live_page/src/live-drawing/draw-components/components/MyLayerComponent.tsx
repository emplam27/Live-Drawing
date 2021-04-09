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
  // if (!props.roomInfo.userId) return <></>;
  return (
    <>
      <canvas
        key={props.roomInfo.userId}
        id={props.roomInfo.userId === null ? undefined : props.roomInfo.userId}
        className={''}
        width={(window.innerWidth - 60) * 0.5}
        height={window.innerHeight}
        onMouseDown={(e) =>
          mouseDown(
            e,
            props.activeTool,
            props.color,
            props.eraserWidth,
            props.lineWidth,
            props.roomInfo,
            props.socket,
          )
        }
        onMouseUp={(e) => mouseUp(e, props.canvasCtxTable)}
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
