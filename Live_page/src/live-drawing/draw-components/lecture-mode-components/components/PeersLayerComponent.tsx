import React from 'react';

import GuestLayerBadgeComponent from './GuestLayerBadgeComponent';
import HostLayerBadgeComponent from './HostLayerBadgeComponent';
import UndrawableCanvasComponent from '../../components/UndrawableCanvasComponent';

import { Layer } from '../../../interfaces/draw-components-interfaces';
import { PeersLayerComponentProps } from '../interfaces/peers-layer-interfaces';

function PeersLayerComponent(props: PeersLayerComponentProps) {
  const badgeStyle =
    'absolute flex justify-center items-center h-20 p-3 mt-10 rounded-full bg-white shadow-md z-20';
  const buttonStyle =
    'flex items-center px-6 h-full text-xl text-white rounded-full bg-blue-500 hover:bg-blue-400 cursor-pointer';

  return (
    <>
      <div
        className={
          'relative cols-start-1 cols-end-2 flex flex-col items-center'
        }
      >
        {props.roomInfo.roomHostId === props.roomInfo.userId ? (
          <HostLayerBadgeComponent
            layers={props.layers}
            roomInfo={props.roomInfo}
            roomUsers={props.roomUsers}
            topLayer={props.topLayer}
            setTopLayer={props.setTopLayer}
            setIsModifiedMode={props.setIsModifiedMode}
            setModifiedTargetUser={props.setModifiedTargetUser}
            badgeStyle={badgeStyle}
            buttonStyle={buttonStyle}
          />
        ) : (
          <GuestLayerBadgeComponent
            layers={props.layers}
            roomInfo={props.roomInfo}
            topLayer={props.topLayer}
            setTopLayer={props.setTopLayer}
            badgeStyle={badgeStyle}
            buttonStyle={buttonStyle}
          />
        )}

        {props.layers.map((layer: Layer) => {
          if (props.topLayer && layer.canvasId !== props.roomInfo.userId) {
            return (
              <UndrawableCanvasComponent
                topLayer={props.topLayer}
                canvasId={layer.canvasId}
              />
            );
          }
        })}
      </div>
    </>
  );
}

export default PeersLayerComponent;
