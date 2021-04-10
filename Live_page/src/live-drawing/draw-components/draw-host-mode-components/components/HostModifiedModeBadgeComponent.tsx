import React from 'react';

import { HostModifiedModeBadgeComponentProps } from '../interfaces/host-modified-mode-badge-interfaces';

import { sendModifiedModeMessage } from '../../functions/modified-mode-functions';

function HostModifiedModeBadgeComponent(
  props: HostModifiedModeBadgeComponentProps,
) {
  function endModifiedMode() {
    if (!props.topLayer || !props.roomUsers || !props.socket) return;
    sendModifiedModeMessage(
      'modified-mode-end',
      props.roomUsers,
      props.topLayer,
      props.socket,
    );
    props.setIsModifiedMode(false);
  }

  return (
    <div
      className={`${props.badgeStyle} ${props.displayHidden ? 'hidden' : ''}`}
    >
      <div className={'flex items-end px-8'}>
        <span className={'font-bold text-3xl'}>{props.topLayer?.username}</span>
        <span className={'text-2xl'}>&nbsp;님의 그림</span>
      </div>
      <div className={props.buttonStyle} onClick={endModifiedMode}>
        <span className={'font-bold'}>그림첨삭 종료하기&nbsp;&nbsp;</span>
        <i className='ri-lg ri-pencil-line'></i>
      </div>
    </div>
  );
}

export default HostModifiedModeBadgeComponent;
