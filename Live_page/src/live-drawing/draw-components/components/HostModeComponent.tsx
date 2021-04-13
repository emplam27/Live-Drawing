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
  const badgeContainerStyle =
    'absolute flex flex-col items-center w-full h-full hover:bg-gray-300 hover:bg-opacity-25 transition duration-150 ease-in-out';
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
          displayHidden={props.isModifiedMode}
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
        />
      </div>
    </div>
  );
}

export default HostModeComponent;
