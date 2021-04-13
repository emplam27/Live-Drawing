import React from 'react';

import UndrawableCanvasComponent from '../../components/UndrawableCanvasComponent';
import { GuestCompareModeLayerComponentProps } from '../interfaces/guest-compare-mode-layer-interfaces';

function GuestCompareModeLayerComponent(
  props: GuestCompareModeLayerComponentProps,
) {
  return (
    <UndrawableCanvasComponent
      canvasId={`compare-${props.roomInfo.userId}`}
      displayHidden={props.displayHidden}
      canvasCtxTable={props.canvasCtxTable}
      socket={props.socket}
      roomInfo={props.roomInfo}
    />
  );
}

export default GuestCompareModeLayerComponent;
