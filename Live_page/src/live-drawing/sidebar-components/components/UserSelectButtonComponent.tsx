import React from 'react';
import { Layer } from '../../interfaces/draw-components-interfaces';
import { UserSelectButtonComponentProps } from '../interfaces/user-select-button-interfaces';
import { UserProfileInfo } from '../../interfaces/socket-interfaces';

function UserSelectButtonComponent(props: UserSelectButtonComponentProps) {
  return (
    <>
      <div className='flex flex-col'>
        {props.layers.map((layer: Layer) => {
          const user = props.userProfileInfos.find(
            (userProfileInfo: UserProfileInfo) =>
              userProfileInfo.userId === layer.canvasId,
          );
          if (layer.canvasId !== props.roomInfo.userId && user)
            return (
              <div
                key={layer.canvasId}
                onClick={() => props.setTopLayer(layer)}
                className={`flex flex-col items-center cursor-pointer
                  ${
                    layer.canvasId === props.roomInfo.roomHostId
                      ? 'order-first py-6 flex flex-col'
                      : 'py-6 flex flex-col'
                  }
                  ${
                    layer.canvasId === props.topLayer?.canvasId
                      ? 'bg-blue-500 text-white shadow-inner '
                      : 'hover:bg-gray-200'
                  }
                `}
              >
                <div
                  className={
                    layer.canvasId === props.roomInfo.roomHostId ? '' : 'hidden'
                  }
                >
                  HOST
                </div>
                <img
                  className={`w-12 h-12 rounded-full my-2 ${
                    layer.canvasId === props.topLayer?.canvasId
                      ? 'ring-2 ring-white shadow-lg'
                      : ''
                  }`}
                  src={`${user.userImage}`}
                  alt={`${user.username}`}
                />
                <p>{`${user.username}`}</p>
              </div>
            );
        })}
      </div>
    </>
  );
}

export default UserSelectButtonComponent;
