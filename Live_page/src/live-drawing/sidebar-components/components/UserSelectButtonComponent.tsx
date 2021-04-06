import React from 'react';
import { Layer } from '../../interfaces/draw-components-interfaces';
import { UserSelectButtonComponentProps } from '../interfaces/user-select-button-interfaces';
import '../index.css';

function UserSelectButtonComponent(props: UserSelectButtonComponentProps) {
  return (
    <>
      <div id='layerButtonContainer' className='flex-col'>
        {props.layers.map((layer) => {
          const user = props.users.find(
            (user) => user.userId === layer.canvasId,
          );
          if (layer.canvasId !== props.roomInfo.userId)
            return (
              <div
                onClick={() => props.setTopLayer(layer)}
                className={
                  layer.canvasId === props.roomInfo.roomHostId ? 'order-1' : ''
                }
              >
                <img
                  src={`${user?.userImage}`}
                  width='3rem'
                  height='3rem'
                  alt={`${user?.userName}`}
                />
                <p>{`${user?.userName}`}</p>
              </div>
            );
        })}
      </div>
    </>
  );
}

export default UserSelectButtonComponent;
