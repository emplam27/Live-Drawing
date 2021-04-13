import React from 'react';
import {
  HostMouseMove,
  HostTouchMove,
} from '../functions/mouse-event-functions';

import { UndrawableCanvasComponentProps } from '../interfaces/undrawable-canvas-component';

export function UndrawableCanvasComponent(
  props: UndrawableCanvasComponentProps,
) {
  return (
    <canvas
      id={props.canvasId}
      className={`${props.displayHidden ? 'hidden' : ''}`}
      width={(window.innerWidth - 60) * 0.5}
      height={window.innerHeight}
      onMouseMove={(e) =>
        HostMouseMove(
          e,
          props.canvasCtxTable,
          props.socket,
          props.roomInfo.roomHostId,
        )
      }
      onTouchMove={(e) =>
        HostTouchMove(
          e,
          props.canvasCtxTable,
          props.socket,
          props.roomInfo.roomHostId,
        )
      }
    ></canvas>
  );
}

// export default UndrawableCanvasComponent;
