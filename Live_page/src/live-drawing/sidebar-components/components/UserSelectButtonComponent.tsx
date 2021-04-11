import React, { useEffect } from 'react';
import { Layer } from '../../interfaces/draw-components-interfaces';
import { UserSelectButtonComponentProps } from '../interfaces/user-select-button-interfaces';
import { UserInfo } from '../../interfaces/socket-interfaces';

function UserSelectButtonComponent(props: UserSelectButtonComponentProps) {
  const [, updateState] = React.useState<number>(0);
  const forceUpdate = React.useCallback(
    () => updateState(new Date().getTime()),
    [],
  );
  const selectTopLayer = (layer: Layer | undefined) => {
    if (layer) props.setTopLayer(layer);
  };
  useEffect(() => {
    forceUpdate();
  }, [props.roomUsers]);

  return (
    <>
      <div className={`flex flex-col ${!props.isModifiedMode ? '' : 'hidden'}`}>
        {props.roomUsers?.users.map((user: UserInfo) => {
          const userLayer = props.layers.find(
            (layer) => layer.canvasId === user.userId,
          );
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
                HOST
              </div>
              <span className='flex h-3 w-3'>
                {props.speakingUsers && props.speakingUsers.length >= 1 ? (
                  <span className='animate-ping absolute inline-flex h-4 w-4 rounded-full bg-purple-400 opacity-75'></span>
                ) : null}
                {/* {props.speakingUsers &&
                user.agoraId &&
                props.speakingUsers.includes(user.agoraId) ? (
                  <span className='animate-ping absolute inline-flex h-4 w-4 rounded-full bg-purple-400 opacity-75'></span>
                ) : null} */}
                <span className='relative inline-flex rounded-full h-3 w-3 bg-purple-500'></span>
              </span>
              <img
                className={`w-12 h-12 rounded-full my-2 ${
                  userLayer?.canvasId === props.topLayer?.canvasId
                    ? 'ring-2 ring-white shadow-lg'
                    : ''
                }`}
                src={`${user.userImage}`}
                alt={`${user.username}`}
              />
              <p className={'w-full truncate px-2'}>{`${user?.username}`}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default UserSelectButtonComponent;
