import React from 'react';

import GuestLayerBadgeComponent from './GuestLayerBadgeComponent';
import HostLayerBadgeComponent from './HostLayerBadgeComponent';

import { Layer } from '../../interfaces/draw-components-interfaces';
import { PeersLayerComponentProps } from '../interfaces/peers-layer-interfaces';

import {
  mouseDown,
  mouseMove,
  mouseUp,
} from '../functions/mouse-event-functions';

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
            topLayer={props.topLayer}
            setTopLayer={props.setTopLayer}
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
          if (layer.canvasId !== props.roomInfo.userId) {
            return (
              <canvas
                key={layer.canvasId}
                id={layer.canvasId}
                className={`${
                  props.topLayer !== null &&
                  props.topLayer.canvasId !== layer.canvasId
                    ? 'hidden z-0'
                    : 'z-10'
                }`}
                width={(window.innerWidth - 60) * 0.5}
                height={window.innerHeight}
                onMouseDown={(e) => mouseDown(e)}
                onMouseUp={mouseUp}
                onMouseMove={(e) =>
                  mouseMove(
                    e,
                    props.activeTool,
                    props.color,
                    props.lineWidth,
                    props.eraserWidth,
                    props.canvasCtxTable,
                    props.socket,
                    props.roomInfo,
                  )
                }
              />
            );
          }
        })}
      </div>
    </>
  );
}

export default PeersLayerComponent;
