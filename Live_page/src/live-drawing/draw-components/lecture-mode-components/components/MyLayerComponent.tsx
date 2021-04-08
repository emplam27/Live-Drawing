import React from 'react';

import { MyLayerComponentProps } from '../interfaces/my-layer-interfaces';

import DrawableCanvasComponent from '../../components/DrawableCanvasComponent';

function MyLayerComponent(props: MyLayerComponentProps) {
  return (
    <>
      {props.roomInfo.userId === null ? null : (
        <DrawableCanvasComponent
          activeTool={props.activeTool}
          canvasCtxTable={props.canvasCtxTable}
          color={props.color}
          eraserWidth={props.eraserWidth}
          lineWidth={props.lineWidth}
          roomInfo={props.roomInfo}
          socket={props.socket}
          canvasId={props.roomInfo.userId}
        />
      )}
    </>
  );
}

export default MyLayerComponent;
