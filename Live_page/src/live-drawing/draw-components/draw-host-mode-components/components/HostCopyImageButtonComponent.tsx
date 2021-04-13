import React from 'react';

import { HostCopyImageButtonComponentProps } from '../interfaces/host-copy-image-badge-interfaces';
import {
  sendModifiedModeMessage,
  copyImageToModifiedCanvasForHostMode,
} from '../../functions/modified-mode-functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function HostCopyImageButtonComponent(
  props: HostCopyImageButtonComponentProps,
) {
  const MySwal = withReactContent(Swal);

  //@ User Canvas의 그림을 해당 User의 Modified Canvas에 복사
  function copyImageFromUserCanvas() {
    if (
      !props.isModifiedMode ||
      !props.topLayer ||
      !props.roomUsers ||
      !props.socket
    )
      return;

    MySwal.fire({
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
        copyImageToModifiedCanvasForHostMode(
          props.topLayer,
          props.canvasCtxTable,
        );
      }
    });
  }

  return (
    <div
      className={`
        ${props.badgeContainerStyle}
        ${props.displayHidden ? 'hidden' : ''}
      `}
    >
      <div className={props.badgeStyle}>
        <div className={'flex items-end px-8'}>
          <span className={'font-bold text-3xl'}>
            {props.topLayer?.username}
          </span>
          <span className={'text-2xl'}>&nbsp;님의 그림 첨삭페이지</span>
        </div>
        <div className={props.buttonStyle} onClick={copyImageFromUserCanvas}>
          <span className={'font-bold'}>
            {props.topLayer?.username}&nbsp;님의 그림 복사하기&nbsp;&nbsp;
          </span>
          <i className=' ri-file-copy-line'></i>
        </div>
      </div>
    </div>
  );
}

export default HostCopyImageButtonComponent;
