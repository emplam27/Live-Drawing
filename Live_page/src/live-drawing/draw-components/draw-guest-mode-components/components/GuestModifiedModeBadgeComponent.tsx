import React from 'react';

import { GuestModifiedModeBadgeComponentProps } from '../interfaces/guest-modified-mode-badge-interfaces';

function GuestModifiedModeBadgeComponent(
  props: GuestModifiedModeBadgeComponentProps,
) {
  return (
    <div
      className={`${props.badgeStyle} ${props.displayHidden ? 'hidden' : ''}`}
    >
      <div className={'flex items-end px-8'}>
        <span className={'text-2xl'}>선생님이 첨삭을 진행중입니다.</span>
      </div>
    </div>
  );
}

export default GuestModifiedModeBadgeComponent;
