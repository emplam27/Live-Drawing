import React from 'react';

import { UndrawableCanvasComponentProps } from '../interfaces/undrawable-canvas-component';

function UndrawableCanvasComponent(props: UndrawableCanvasComponentProps) {
  return (
    <>
      <canvas
        key={props.canvasId}
        id={props.canvasId}
        className={`${
          props.topLayer !== null && props.topLayer.canvasId !== props.canvasId
            ? 'hidden z-0'
            : 'z-10'
        }`}
        width={(window.innerWidth - 60) * 0.5}
        height={window.innerHeight}
      />
    </>
  );
}

export default UndrawableCanvasComponent;
