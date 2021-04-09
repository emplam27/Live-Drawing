import React, { useEffect } from 'react';

import DrawableCanvasComponent from '../../components/DrawableCanvasComponent';

import { HostModifiedModeLayerComponentProps } from '../interfaces/host-modified-mode-layer-interfaces';
import { Layer } from '../../../interfaces/draw-components-interfaces';

function HostModifiedModeLayerComponent(
  props: HostModifiedModeLayerComponentProps,
) {
  //@ Modified 모드가 시작되면 canvas의 그림 복사
  useEffect(() => {
    if (!props.isModifiedMode) return;
    // topLayer의 그림을 modified 레이어로 복사
  }, [props.isModifiedMode]);

  return (
    <div className={`${props.displayHidden ? 'hidden' : ''}`}>
      {props.modifiedLayers.map((layer: Layer) => {
        if (props.topLayer) {
          const hidden =
            layer.canvasId !== `modified-${props.topLayer.canvasId}`;
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

export default HostModifiedModeLayerComponent;
