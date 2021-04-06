import React from 'react';
import { Layer } from '../../interfaces/draw-components-interfaces';
import { UserSelectButtonComponentProps } from '../interfaces/user-select-button-interfaces';
import '../index.css';

function UserSelectButtonComponent(props: UserSelectButtonComponentProps) {
  function selectActiveLayer(layer: Layer) {
    props.setTopLayer(layer);
  }

  return (
    <>
      <div id='layerButtonContainer'>
        {props.layers.map((layer: Layer) => {
          if (layer.canvasId !== props.roomInfo.userId)
            return (
              <span
                key={layer.canvasId}
                id={layer.buttonId}
                className={`layer_space ${
                  props.topLayer != null && props.topLayer.name === layer.name
                    ? 'active-layer'
                    : ''
                }`}
                onClick={() => selectActiveLayer(layer)}
              >
                {layer.name}
              </span>
            );
        })}
      </div>
    </>
  );
}

export default UserSelectButtonComponent;
