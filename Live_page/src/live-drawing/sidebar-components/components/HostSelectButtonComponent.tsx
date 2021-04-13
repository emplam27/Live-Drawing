import React, { useEffect } from 'react';
import { Layer } from '../../interfaces/draw-components-interfaces';
import { HostSelectButtonComponentProps } from '../interfaces/host-select-button-interfaces';
import { UserInfo } from '../../interfaces/socket-interfaces';

function HostSelectButtonComponent(props: HostSelectButtonComponentProps) {
  const selectTopLayer = (layer: Layer | undefined) => {
    if (layer) props.setTopLayer(layer);
  };

  return (
    <>
      <div className={`flex flex-col ${!props.isModifiedMode ? '' : 'hidden'}`}>
        {props.roomUsers?.users.map((user: UserInfo) => {
          const userLayer = props.layers.find(
            (layer) => layer.canvasId === user.userId,
          );
          if (user.userId === props.roomInfo.roomHostId)
            return (
              <div
                key={user.userId}
                onClick={() => selectTopLayer(userLayer)}
                className={`flex flex-col items-center cursor-pointer
                    ${
                      userLayer?.canvasId === props.roomInfo.roomHostId
                        ? 'order-first py-6 flex flex-col'
                        : 'py-6 flex flex-col'
                    }
                    ${
                      userLayer?.canvasId === props.topLayer?.canvasId
                        ? 'bg-blue-500 text-white shadow-inner '
                        : 'hover:bg-gray-200'
                    }
                  `}
              >
                <div
                  className={
                    userLayer?.canvasId === props.roomInfo.roomHostId
                      ? ''
                      : 'hidden'
                  }
                >
                  <div>
                    <i className='ri-vip-crown-2-fill'></i>
                  </div>
                  선생님
                </div>

                <span className='flex justify-center items-center'>
                  {props.speakingUsers && props.speakingUsers.length >= 1 ? (
                    <span className='animate-ping absolute h-10 w-10 rounded-full bg-black opacity-75'></span>
                  ) : null}
                  <img
                    className={`w-12 h-12 relative  rounded-full  my-2   ${
                      userLayer?.canvasId === props.topLayer?.canvasId
                        ? 'ring-2 ring-white shadow-lg'
                        : ''
                    }`}
                    src={`${user.userImage}`}
                  />
                </span>
                <p className={'w-full truncate px-2'}>{user?.username}</p>
              </div>
            );
        })}
      </div>
    </>
  );
}

export default HostSelectButtonComponent;
