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
    />
  );
}

export default GuestCompareModeLayerComponent;
