import React from 'react';

import UndrawableCanvasComponent from './UndrawableCanvasComponent';
// import DrawableCanvasComponent from './DrawableCanvasComponent';
import { Layer } from '../../interfaces/draw-components-interfaces';
import { PeersLayerComponentProps } from '../interfaces/peers-layer-interfaces';

function PeersLayerComponent(props: PeersLayerComponentProps) {
  return (
    <div className={`${props.displayHidden ? 'hidden' : ''}`}>
      {props.layers.map((layer: Layer) => {
        if (props.topLayer && layer.canvasId !== props.roomInfo.userId) {
          const displayHidden = props.topLayer.canvasId !== layer.canvasId;
          return (
            // <DrawableCanvasComponent
            //   key={layer.canvasId}
            //   activeTool={props.activeTool}
            //   canvasCtxTable={props.canvasCtxTable}
            //   color={props.color}
            //   eraserWidth={props.eraserWidth}
            //   lineWidth={props.lineWidth}
            //   roomInfo={props.roomInfo}
            //   socket={props.socket}
            //   canvasId={layer.canvasId}
            //   displayHidden={displayHidden}
            // />
            <UndrawableCanvasComponent
              key={layer.canvasId}
              canvasId={layer.canvasId}
              displayHidden={displayHidden}
            />
          );
        }
      })}
    </div>
  );
}

export default PeersLayerComponent;
