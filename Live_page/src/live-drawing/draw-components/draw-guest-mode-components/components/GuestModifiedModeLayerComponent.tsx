import React, { useEffect } from 'react';

import DrawableCanvasComponent from '../../components/DrawableCanvasComponent';
// import UndrawableCanvasComponent from '../../components/UndrawableCanvasComponent';
import { GuestModifiedModeLayerComponentProps } from '../interfaces/guest-modified-mode-layer-interfaces';
import { copyImageToModifiedCanvasForGuestMode } from '../../functions/modified-mode-functions';

function GuestModifiedModeLayerComponent(
  props: GuestModifiedModeLayerComponentProps,
) {
  //@ Copy Modified Canvas
  useEffect(() => {
    if (!props.copyModifiedCanvasSignal || !props.roomInfo) return;
    copyImageToModifiedCanvasForGuestMode(props.roomInfo, props.canvasCtxTable);
  }, [props.copyModifiedCanvasSignal]);

  return (
    <div className={`${props.displayHidden ? 'hidden' : ''}`}>
      <DrawableCanvasComponent
        activeTool={props.activeTool}
        canvasCtxTable={props.canvasCtxTable}
        color={props.color}
        eraserWidth={props.eraserWidth}
        lineWidth={props.lineWidth}
        roomInfo={props.roomInfo}
        socket={props.socket}
        canvasId={`modified-${props.roomInfo.userId}`}
        displayHidden={false}
        setHidden={props.setHidden}
        setPosition={props.setPosition}
      />
      {/* <UndrawableCanvasComponent
        canvasId={`modified-${props.roomInfo.userId}`}
        displayHidden={false}
      /> */}
    </div>
  );
}

export default GuestModifiedModeLayerComponent;
