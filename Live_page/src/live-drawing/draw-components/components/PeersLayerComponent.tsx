import React from 'react';

// import UndrawableCanvasComponent from '../../components/UndrawableCanvasComponent';
import DrawableCanvasComponent from './DrawableCanvasComponent';

import { Layer } from '../../interfaces/draw-components-interfaces';
import { PeersLayerComponentProps } from '../interfaces/peers-layer-interfaces';

function PeersLayerComponent(props: PeersLayerComponentProps) {
  return (
    <>
      {props.layers.map((layer: Layer) => {
        if (props.topLayer && layer.canvasId !== props.roomInfo.userId) {
          const undrawableCanvasclassName =
            props.topLayer.canvasId === layer.canvasId ? 'z-10' : 'hidden z-0';

          return (
            <DrawableCanvasComponent
              key={layer.canvasId}
              canvasId={layer.canvasId}
              drawableCanvasclassName={undrawableCanvasclassName}
              activeTool={props.activeTool}
              canvasCtxTable={props.canvasCtxTable}
              color={props.color}
              eraserWidth={props.eraserWidth}
              lineWidth={props.lineWidth}
              roomInfo={props.roomInfo}
              socket={props.socket}
            />
          );
        }
      })}
    </>
  );
}

export default PeersLayerComponent;
