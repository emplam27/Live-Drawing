import React from 'react';

import { HostLectureModeBadgeComponentProps } from '../interfaces/host-lecture-mode-badge-interfaces';

import { sendModifiedModeMessage } from '../../functions/modified-mode-functions';

function HostLectureModeBadgeComponent(
  props: HostLectureModeBadgeComponentProps,
) {
  function startModifiedMode() {
    if (!props.topLayer || !props.roomUsers || !props.socket) return;
    sendModifiedModeMessage(
      'modified-mode-start',
      props.roomUsers,
      props.topLayer,
      props.socket,
    );
    props.setIsModifiedMode(true);
  }

  return (
    <div
      className={`${props.badgeStyle} ${props.displayHidden ? 'hidden' : ''}`}
    >
      <div className={'flex items-end px-8'}>
        <span className={'font-bold text-3xl'}>{props.topLayer?.username}</span>
        <span className={'text-2xl'}>&nbsp;님의 그림</span>
      </div>
      <div className={props.buttonStyle} onClick={startModifiedMode}>
        <span className={'font-bold'}>그림첨삭 시작하기&nbsp;&nbsp;</span>
        <i className='ri-lg ri-pencil-line'></i>
      </div>
    </div>
  );
}

export default HostLectureModeBadgeComponent;
