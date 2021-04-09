import React from 'react';

import { MyLayerComponentProps } from '../interfaces/my-layer-interfaces';

import DrawableCanvasComponent from './DrawableCanvasComponent';

function MyLayerComponent(props: MyLayerComponentProps) {
  return (
    <>
      {props.roomInfo.userId ? (
        <DrawableCanvasComponent
          activeTool={props.activeTool}
          canvasCtxTable={props.canvasCtxTable}
          color={props.color}
          eraserWidth={props.eraserWidth}
          lineWidth={props.lineWidth}
          roomInfo={props.roomInfo}
          socket={props.socket}
          canvasId={props.roomInfo.userId}
          hidden={props.displayHidden}
        />
      ) : (
        <div className='flex flex-col justify-center h-full'>
          <p>
            <i className='ri-loader-4-line text-8xl text-gray-300 animate-spin'></i>
          </p>
          <p className='text-xl'>로딩중입니다.</p>
          <p className='text-xl'>잠시만 기다려주세요.</p>
        </div>
      )}
    </>
  );
}

export default MyLayerComponent;
