import React from 'react';

import PeersLayerComponent from './PeersLayerComponent';
import LectureStartComponent from '../draw-lecture-start-components/components/LectureStartComponent';
import MyLayerComponent from './MyLayerComponent';
import HostLayerBadgeComponent from '../draw-host-mode-components/components/HostLayerBadgeComponent';

import { HostModeComponentProps } from '../interfaces/host-mode-interfaces';

function HostModeComponent(props: HostModeComponentProps) {
  const badgeStyle =
    'absolute flex justify-center items-center h-20 p-3 mt-10 rounded-full bg-white shadow-md z-20';
  const buttonStyle =
    'flex items-center px-6 h-full text-xl text-white rounded-full bg-blue-500 hover:bg-blue-400 cursor-pointer';

  return (
    <>
      <div className={props.layerContainerGridStyle}>
        <div
          id='undrawable-canvas'
          className='cols-start-1 cols-end-2 relative hover:bg-gray-100'
        >
          {!props.isLectureStarted ? (
            <LectureStartComponent
              roomInfo={props.roomInfo}
              setIsLectureStarted={props.setIsLectureStarted}
            />
          ) : (
            <>
              <div className={'relative flex flex-col items-center'}>
                <HostLayerBadgeComponent
                  isModifiedMode={props.isModifiedMode}
                  layers={props.layers}
                  roomInfo={props.roomInfo}
                  roomUsers={props.roomUsers}
                  topLayer={props.topLayer}
                  setTopLayer={props.setTopLayer}
                  setIsModifiedMode={props.setIsModifiedMode}
                  badgeStyle={badgeStyle}
                  buttonStyle={buttonStyle}
                />
              </div>
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
                setTopLayer={props.setTopLayer}
              />
            </>
          )}
        </div>
        <div id='drawable-canvas' className='cols-start-2 cols-end-3 relative'>
          <MyLayerComponent
            activeTool={props.activeTool}
            canvasCtxTable={props.canvasCtxTable}
            color={props.color}
            eraserWidth={props.eraserWidth}
            isModifiedMode={props.isModifiedMode}
            lineWidth={props.lineWidth}
            roomInfo={props.roomInfo}
            socket={props.socket}
          />
        </div>
      </div>
    </>
  );
}

export default HostModeComponent;
