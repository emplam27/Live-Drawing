import React from 'react';

import '../index.css';

import { Layer } from '../../interfaces/draw-components-interfaces';
import { PeersLayerComponentProps } from '../interfaces/peers-layer-interfaces';

import {
  mouseDown,
  mouseMove,
  mouseUp,
} from '../functions/mouse-event-functions';

function PeersLayerComponent(props: PeersLayerComponentProps) {
  return (
    <>
      {props.layers.map((layer: Layer) => {
        if (layer.canvasId !== props.roomInfo.userId) {
          return (
            <canvas
              key={layer.canvasId}
              id={layer.canvasId}
              className={`cols-start-1 cols-end-2 
              ${
                props.topLayer !== null &&
                props.topLayer.canvasId !== layer.canvasId
                  ? 'hidden z-0'
                  : 'z-10'
              }`}
              width={(window.innerWidth - 60) * 0.5}
              height={window.innerHeight}
              onMouseDown={(e) => mouseDown(e, props.canvasCtxTable)}
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
          );
        }
      })}
    </>
  );
}

export default PeersLayerComponent;
