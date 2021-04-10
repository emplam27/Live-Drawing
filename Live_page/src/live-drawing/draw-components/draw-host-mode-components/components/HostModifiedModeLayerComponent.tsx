import React from 'react';

import DrawableCanvasComponent from '../../components/DrawableCanvasComponent';

import { HostModifiedModeLayerComponentProps } from '../interfaces/host-modified-mode-layer-interfaces';
import { Layer } from '../../../interfaces/draw-components-interfaces';

import {
  sendModifiedModeMessage,
  copyImageToModifiedCanvas,
} from '../../functions/modified-mode-functions';

import Swal from 'sweetalert2';

function HostModifiedModeLayerComponent(
  props: HostModifiedModeLayerComponentProps,
) {
  //@ User Canvas의 그림을 해당 User의 Modified Canvas에 복사
  function copyImageFromUserCanvas() {
    if (
      !props.isModifiedMode ||
      !props.topLayer ||
      !props.roomUsers ||
      !props.socket
    )
      return;
    Swal.fire({
      title: `${props.topLayer.username}님의 원본 그림을 복제하시겠습니까?`,
      text: '기존에 복제된 그림은 사라집니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        if (
          !props.topLayer ||
          !props.topLayer ||
          !props.roomUsers ||
          !props.socket
        )
          return;

        //@ 'modified-mode-copy-canvas' Event Emit
        sendModifiedModeMessage(
          'modified-mode-copy-canvas',
          props.roomUsers,
          props.topLayer,
          props.socket,
        );

        //@ Copy Modified Canvas
        copyImageToModifiedCanvas(props.topLayer, props.canvasCtxTable);
      }
    });
  }

  return (
    <div className={`${props.displayHidden ? 'hidden' : ''}`}>
      <div onClick={copyImageFromUserCanvas}>
        {props.topLayer?.username}님의 그림 복사하기
      </div>
      {props.modifiedLayers.map((layer: Layer) => {
        if (props.topLayer) {
          const displayHidden =
            layer.canvasId !== `modified-${props.topLayer.canvasId}`;
          return (
            <DrawableCanvasComponent
              activeTool={props.activeTool}
              canvasCtxTable={props.canvasCtxTable}
              color={props.color}
              eraserWidth={props.eraserWidth}
              lineWidth={props.lineWidth}
              roomInfo={props.roomInfo}
              socket={props.socket}
              canvasId={layer.canvasId}
              displayHidden={displayHidden}
            />
          );
        }
      })}
    </div>
  );
}

export default HostModifiedModeLayerComponent;
