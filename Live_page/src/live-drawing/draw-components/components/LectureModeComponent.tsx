import React from 'react';

import PeersLayerComponent from '../lecture-mode-components/components/PeersLayerComponent';
import MyLayerComponent from '../lecture-mode-components/components/MyLayerComponent';

import { LectureModeComponentProps } from '../interfaces/lecture-mode-interfaces';

function LectureModeComponent(props: LectureModeComponentProps) {
  return (
    <>
      <div className={props.layerContainerGridStyle}>
        <div
          id='undrawable-canvas'
          className='cols-start-1 cols-end-2 relative'
        >
          {props.layers.length <= 1 ? (
            <div className='flex flex-col justify-center h-full'>
              <p>
                <i className='ri-group-line text-8xl text-gray-300'></i>
              </p>
              <p className='text-xl '>참여한 게스트가 없습니다!</p>
              <p className='text-xl'>게스트가 참여하면 여기에 표시됩니다.</p>
            </div>
          ) : (
            <PeersLayerComponent
              activeTool={props.activeTool}
              canvasCtxTable={props.canvasCtxTable}
              color={props.color}
              eraserWidth={props.eraserWidth}
              layers={props.layers}
              lineWidth={props.lineWidth}
              roomInfo={props.roomInfo}
              roomUsers={props.roomUsers}
              socket={props.socket}
              topLayer={props.topLayer}
              setIsModifiedMode={props.setIsModifiedMode}
              setModifiedTargetUser={props.setModifiedTargetUser}
              setTopLayer={props.setTopLayer}
            />
          )}
        </div>
        <div id='drawable-canvas' className='cols-start-2 cols-end-3 relative'>
          <MyLayerComponent
            activeTool={props.activeTool}
            canvasCtxTable={props.canvasCtxTable}
            color={props.color}
            eraserWidth={props.eraserWidth}
            lineWidth={props.lineWidth}
            roomInfo={props.roomInfo}
            socket={props.socket}
          />
        </div>
      </div>
    </>
  );
}

export default LectureModeComponent;
