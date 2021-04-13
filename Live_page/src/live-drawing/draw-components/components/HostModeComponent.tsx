import React from 'react';

import PeersLayerComponent from './PeersLayerComponent';
import LectureStartComponent from '../draw-lecture-start-components/components/LectureStartComponent';
import HostLectureModeBadgeComponent from '../draw-host-mode-components/components/HostLectureModeBadgeComponent';
import HostModifiedModeBadgeComponent from '../draw-host-mode-components/components/HostModifiedModeBadgeComponent';
import HostCopyImageButtonComponent from '../draw-host-mode-components/components/HostCopyImageButtonComponent';
import MyLayerComponent from './MyLayerComponent';
import HostModifiedModeLayerComponent from '../draw-host-mode-components/components/HostModifiedModeLayerComponent';
import { HostModeComponentProps } from '../interfaces/host-mode-interfaces';

function HostModeComponent(props: HostModeComponentProps) {
  const badgeContainerStyle = 'absolute flex justify-center top-0 w-full';
  const badgeStyle =
    'absolute flex justify-center items-center h-20 p-3 mt-10 rounded-full bg-white shadow-md z-20';
  const buttonStyle =
    'flex items-center px-6 h-full text-xl text-white rounded-full bg-blue-500 hover:bg-blue-400 cursor-pointer';

  return (
    <div className={props.layerContainerGridStyle}>
      <div
        id='undrawable-canvas'
        className='cols-start-1 cols-end-2 relative flex justify-center items-center overflow-hidden bg-gray-200'
      >
        {!props.isLectureStarted ? (
          <LectureStartComponent
            roomInfo={props.roomInfo}
            socket={props.socket}
            setIsLectureStarted={props.setIsLectureStarted}
          />
        ) : props.layers.length <= 1 ? (
          <div className='flex flex-col justify-center h-full'>
            <p>
              <i className='ri-group-line text-8xl text-gray-300'></i>
            </p>
            <p className='text-xl '>참여한 게스트가 없습니다!</p>
            <p className='text-xl'>게스트가 참여하면 여기에 표시됩니다.</p>
          </div>
        ) : null}
        <HostLectureModeBadgeComponent
          isModifiedMode={props.isModifiedMode}
          layers={props.layers}
          roomInfo={props.roomInfo}
          roomUsers={props.roomUsers}
          topLayer={props.topLayer}
          socket={props.socket}
          setTopLayer={props.setTopLayer}
          setIsModifiedMode={props.setIsModifiedMode}
          badgeContainerStyle={badgeContainerStyle}
          badgeStyle={badgeStyle}
          buttonStyle={buttonStyle}
          displayHidden={props.isModifiedMode}
        />
        <HostModifiedModeBadgeComponent
          isModifiedMode={props.isModifiedMode}
          layers={props.layers}
          roomInfo={props.roomInfo}
          roomUsers={props.roomUsers}
          topLayer={props.topLayer}
          socket={props.socket}
          setTopLayer={props.setTopLayer}
          setIsModifiedMode={props.setIsModifiedMode}
          badgeContainerStyle={badgeContainerStyle}
          badgeStyle={badgeStyle}
          buttonStyle={buttonStyle}
          displayHidden={!props.isModifiedMode}
        />
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
          displayHidden={false}
        />
      </div>
      <div
        id='drawable-canvas'
        className='cols-start-2 cols-end-3 relative flex justify-center items-center overflow-hidden bg-gray-200'
      >
        <HostCopyImageButtonComponent
          canvasCtxTable={props.canvasCtxTable}
          isModifiedMode={props.isModifiedMode}
          layers={props.layers}
          roomInfo={props.roomInfo}
          roomUsers={props.roomUsers}
          topLayer={props.topLayer}
          socket={props.socket}
          setTopLayer={props.setTopLayer}
          setIsModifiedMode={props.setIsModifiedMode}
          badgeContainerStyle={badgeContainerStyle}
          badgeStyle={badgeStyle}
          buttonStyle={buttonStyle}
          displayHidden={!props.isModifiedMode}
        />
        <MyLayerComponent
          activeTool={props.activeTool}
          canvasCtxTable={props.canvasCtxTable}
          color={props.color}
          eraserWidth={props.eraserWidth}
          isModifiedMode={props.isModifiedMode}
          lineWidth={props.lineWidth}
          roomInfo={props.roomInfo}
          socket={props.socket}
          badgeContainerStyle={badgeContainerStyle}
          badgeStyle={badgeStyle}
          displayHidden={props.isModifiedMode}
          setHidden={props.setHidden}
          setPosition={props.setPosition}
        />
        <HostModifiedModeLayerComponent
          activeTool={props.activeTool}
          canvasCtxTable={props.canvasCtxTable}
          color={props.color}
          eraserWidth={props.eraserWidth}
          isModifiedMode={props.isModifiedMode}
          lineWidth={props.lineWidth}
          modifiedLayers={props.modifiedLayers}
          roomInfo={props.roomInfo}
          roomUsers={props.roomUsers}
          socket={props.socket}
          topLayer={props.topLayer}
          displayHidden={!props.isModifiedMode}
          setHidden={props.setHidden}
          setPosition={props.setPosition}
        />
      </div>
    </div>
  );
}

export default HostModeComponent;
