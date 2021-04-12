import React from 'react';

import { HostModifiedModeBadgeComponentProps } from '../interfaces/host-modified-mode-badge-interfaces';
import { sendModifiedModeMessage } from '../../functions/modified-mode-functions';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function HostModifiedModeBadgeComponent(
  props: HostModifiedModeBadgeComponentProps,
) {
  const MySwal = withReactContent(Swal);

  function endModifiedMode() {
    if (!props.topLayer || !props.roomUsers || !props.socket) return;
    sendModifiedModeMessage(
      'modified-mode-end',
      props.roomUsers,
      props.topLayer,
      props.socket,
    );
    props.setIsModifiedMode(false);
    props.setIsModifiedMode(true);
    MySwal.fire({
      icon: 'success',
      title: `${props.topLayer.username} 학생의 첨삭을 종료합니다.`,
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      allowOutsideClick: false,
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
          <span className={'text-2xl'}>&nbsp;님의 그림</span>
        </div>
        <div className={props.buttonStyle} onClick={endModifiedMode}>
          <span className={'font-bold'}>그림첨삭 종료하기&nbsp;&nbsp;</span>
          <i className='ri-lg ri-pencil-line'></i>
        </div>
      </div>
    </div>
  );
}

export default HostModifiedModeBadgeComponent;
