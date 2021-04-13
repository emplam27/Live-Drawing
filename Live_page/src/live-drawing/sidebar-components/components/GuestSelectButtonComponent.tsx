import React from 'react';

import { Layer } from '../../interfaces/draw-components-interfaces';
import { GuestSelectButtonComponentProps } from '../interfaces/guest-select-button-interfaces';
import { UserInfo } from '../../interfaces/socket-interfaces';

import Carousel from '@brainhubeu/react-carousel';
import '@brainhubeu/react-carousel/lib/style.css';

function GuestSelectButtonComponent(props: GuestSelectButtonComponentProps) {
  const selectTopLayer = (layer: Layer | undefined) => {
    if (layer) props.setTopLayer(layer);
  };

  return (
    <>
      <div className={`flex flex-col ${!props.isModifiedMode ? '' : 'hidden'}`}>
        <Carousel>
          {props.roomUsers &&
            props.roomUsers.users &&
            props.roomUsers.users.map((user: UserInfo) => {
              const userLayer = props.layers.find(
                (layer) => user.userId === layer.canvasId,
              );
              if (
                user.userId !== props.roomInfo.userId &&
                user.userId !== props.roomInfo.roomHostId
              )
                return (
                  <div
                    key={user.userId}
                    onClick={() => selectTopLayer(userLayer)}
                    className={`flex flex-col items-center py-6 cursor-pointer
                  ${
                    userLayer?.canvasId === props.topLayer?.canvasId
                      ? 'bg-blue-500 text-white shadow-inner '
                      : 'hover:bg-gray-200'
                  }
                `}
                  >
                    <span className='flex h-3 w-3'>
                      {props.speakingUsers &&
                      user.agoraId &&
                      props.speakingUsers.includes(user.agoraId) ? (
                        <span className='animate-ping absolute inline-flex h-4 w-4 rounded-full bg-purple-400 opacity-75'></span>
                      ) : null}
                      <span className='relative inline-flex rounded-full h-3 w-3 bg-purple-500'></span>
                    </span>
                    <img
                      className={`w-12 h-12 rounded-full my-2 ${
                        userLayer?.canvasId === props.topLayer?.canvasId
                          ? 'ring-2 ring-white shadow-lg'
                          : ''
                      }`}
                      src={user.userImage}
                      alt={user.username}
                    />
                    {props.roomInfo.userId === props.roomInfo.roomHostId ? (
                      <p className={'w-full truncate px-2'}>{user.username}</p>
                    ) : null}
                  </div>
                );
            })}
        </Carousel>
      </div>
    </>
  );
}

export default GuestSelectButtonComponent;
