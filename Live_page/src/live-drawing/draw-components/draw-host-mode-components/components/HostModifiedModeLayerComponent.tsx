import React from 'react';

import DrawableCanvasComponent from '../../components/DrawableCanvasComponent';
import { HostModifiedModeLayerComponentProps } from '../interfaces/host-modified-mode-layer-interfaces';
import { Layer } from '../../../interfaces/draw-components-interfaces';

function HostModifiedModeLayerComponent(
  props: HostModifiedModeLayerComponentProps,
) {
  return (
    <div className={`${props.displayHidden ? 'hidden' : ''}`}>
      {props.modifiedLayers.map((layer: Layer) => {
        if (props.topLayer) {
          const displayHidden =
            layer.canvasId !== `modified-${props.topLayer.canvasId}`;
          return (
            <DrawableCanvasComponent
              key={layer.canvasId}
              activeTool={props.activeTool}
              canvasCtxTable={props.canvasCtxTable}
              color={props.color}
              eraserWidth={props.eraserWidth}
              lineWidth={props.lineWidth}
              roomInfo={props.roomInfo}
              socket={props.socket}
              canvasId={layer.canvasId}
              displayHidden={displayHidden}
              setHidden={props.setHidden}
              setPosition={props.setPosition}
            />
          );
        }
      })}
    </div>
  );
}

export default HostModifiedModeLayerComponent;
