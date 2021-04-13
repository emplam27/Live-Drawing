import React from 'react';

import { UndrawableCanvasComponentProps } from '../interfaces/undrawable-canvas-component';

function UndrawableCanvasComponent(props: UndrawableCanvasComponentProps) {
  return (
    <canvas
      id={props.canvasId}
      className={`bg-white ${props.displayHidden ? 'hidden' : ''}`}
      width={(1920 - 60) * 0.5}
      height={1080}
    />
  );
}

export default UndrawableCanvasComponent;
