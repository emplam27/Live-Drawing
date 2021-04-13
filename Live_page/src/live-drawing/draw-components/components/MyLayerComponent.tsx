import { Color } from 'fabric/fabric-impl';
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
          displayHidden={props.displayHidden}
        />
      ) : (
        <div className='flex flex-col justify-center items-center w-full h-full bg-gray-200'>
          <svg
            className='animate-spin mb-2'
            viewBox='0 0 24 24'
            width='72'
            height='72'
          >
            <path
              fill='#9CA3AF'
              d='M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z'
            />
          </svg>
          <p className='text-xl'>로딩중입니다.</p>
          <p className='text-xl'>잠시만 기다려주세요.</p>
        </div>
      )}
    </>
  );
}

export default MyLayerComponent;
