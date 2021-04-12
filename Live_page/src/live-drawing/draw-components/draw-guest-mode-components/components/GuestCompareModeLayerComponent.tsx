import React from 'react';

import UndrawableCanvasComponent from '../../components/UndrawableCanvasComponent';
import { GuestCompareModeLayerComponentProps } from '../interfaces/guest-compare-mode-layer-interfaces';

function GuestCompareModeLayerComponent(
  props: GuestCompareModeLayerComponentProps,
) {
  return (
    <div className={`${props.displayHidden ? 'hidden' : ''}`}>
      <UndrawableCanvasComponent
        canvasId={`compare-${props.roomInfo.userId}`}
        displayHidden={false}
      />
    </div>
  );
}

export default GuestCompareModeLayerComponent;
