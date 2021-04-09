import React from 'react';

// import UndrawableCanvasComponent from '../../components/UndrawableCanvasComponent';
import DrawableCanvasComponent from './DrawableCanvasComponent';

import { Layer } from '../../interfaces/draw-components-interfaces';
import { PeersLayerComponentProps } from '../interfaces/peers-layer-interfaces';

function PeersLayerComponent(props: PeersLayerComponentProps) {
  return (
    <div className={`${props.displayHidden ? 'hidden' : ''}`}>
      {props.layers.map((layer: Layer) => {
        if (props.topLayer && layer.canvasId !== props.roomInfo.userId) {
          const hidden = props.topLayer.canvasId !== layer.canvasId;
          return (
            <DrawableCanvasComponent
              activeTool={props.activeTool}
              canvasCtxTable={props.canvasCtxTable}
              color={props.color}
              eraserWidth={props.eraserWidth}
              lineWidth={props.lineWidth}
              roomInfo={props.roomInfo}
              socket={props.socket}
              canvasId={layer.canvasId}
              hidden={hidden}
            />
          );
        }
      })}
    </div>
  );
}

export default PeersLayerComponent;
