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
          if (user.userId !== props.roomInfo.userId)
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
