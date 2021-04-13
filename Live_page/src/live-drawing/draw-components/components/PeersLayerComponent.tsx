import React from 'react';

import { UndrawableCanvasComponent } from './UndrawableCanvasComponent';
// import DrawableCanvasComponent from './DrawableCanvasComponent';
import { Layer } from '../../interfaces/draw-components-interfaces';
import { PeersLayerComponentProps } from '../interfaces/peers-layer-interfaces';

function PeersLayerComponent(props: PeersLayerComponentProps) {
  return (
    <div className={props.displayHidden ? 'hidden' : ''}>
      {props.layers.map((layer: Layer) => {
        if (props.topLayer && layer.canvasId !== props.roomInfo.userId) {
          const peersCanvasDisplayHidden =
            props.topLayer.canvasId !== layer.canvasId;
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
            //   setHidden={props.setHidden}
            //   setPosition={props.setPosition}
            // />
            <UndrawableCanvasComponent
              canvasId={layer.canvasId}
              canvasCtxTable={props.canvasCtxTable}
              socket={props.socket}
              roomInfo={props.roomInfo}
              key={layer.canvasId}
              displayHidden={peersCanvasDisplayHidden}
            />
          );
        }
      })}
    </div>
  );
}

export default PeersLayerComponent;
