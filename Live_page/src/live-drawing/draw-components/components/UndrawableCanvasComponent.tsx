import React from 'react';

import { UndrawableCanvasComponentProps } from '../interfaces/undrawable-canvas-component';

function UndrawableCanvasComponent(props: UndrawableCanvasComponentProps) {
  return (
    <canvas
      id={props.canvasId}
      className={`${props.displayHidden ? 'hidden' : ''}`}
      width={(window.innerWidth - 60) * 0.5}
      height={window.innerHeight}
    />
  );
}

export default UndrawableCanvasComponent;
