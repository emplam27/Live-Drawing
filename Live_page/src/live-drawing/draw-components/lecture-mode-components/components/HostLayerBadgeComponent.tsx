import { UserInfo } from '../../../interfaces/socket-interfaces';
import React from 'react';

import { HostLayerBadgeComponentProps } from '../interfaces/host-layer-badge-interfaces';

function HostLayerBadgeComponent(props: HostLayerBadgeComponentProps) {
  function startModifiedMode(canvasId: string | undefined) {
    props.setIsModifiedMode(true);
    const targetUser = props.roomUsers?.users.find((user: UserInfo) => {
      return user.userId === canvasId;
    });
    if (targetUser) props.setModifiedTargetUser(targetUser);
  }

  return (
    <>
      <div className={props.badgeStyle}>
        <div className={'flex items-end px-8'}>
          <span className={'font-bold text-3xl'}>
            {props.topLayer?.username}
          </span>
          <span className={'text-2xl'}>&nbsp;님의 그림</span>
        </div>
        <div
          className={props.buttonStyle}
          onClick={() => startModifiedMode(props.topLayer?.canvasId)}
        >
          <span className={'font-bold'}>그림첨삭 시작하기&nbsp;&nbsp;</span>
          <i className='ri-lg ri-pencil-line'></i>
        </div>
      </div>
    </>
  );
}

export default HostLayerBadgeComponent;
