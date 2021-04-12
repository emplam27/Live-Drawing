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
      className={`relative flex flex-col items-start
      ${props.displayHidden ? 'hidden' : ''}
    `}
    >
      <div
        className={
          'absolute flex justify-center items-center h-20 p-3 mt-10 text-white rounded-r-full bg-blue-500 hover:bg-blue-400 shadow-md z-20 cursor-pointer'
        }
        onClick={copyImageFromUserCanvas}
      >
        <div className={'flex items-end px-8'}>
          <span className={'font-bold text-3xl'}>
            {props.topLayer?.username}
          </span>
          <span className={'text-2xl'}>&nbsp;님의 그림 복사하기</span>
        </div>
        {/* <div
          className={
            'flex items-center px-6 h-full text-xl text-white rounded-full bg-blue-500 hover:bg-blue-400 cursor-pointer'
          }
          
        >
          <span className={'font-bold'}>
            {props.topLayer?.username}님의 그림 복사하기&nbsp;&nbsp;
          </span>
          <i className='ri-lg ri-pencil-line'></i>
        </div> */}
      </div>
    </div>
  );
}

export default HostCopyImageButtonComponent;
