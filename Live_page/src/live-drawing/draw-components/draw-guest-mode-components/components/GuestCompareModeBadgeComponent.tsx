import React from 'react';

import { GuestCompareModeBadgeComponentProps } from '../interfaces/guest-compare-mode-badge-interfaces';
import { copyImageToCompareCanvasForGuestMode } from '../../functions/modified-mode-functions';

function GuestCompareModeBadgeComponent(
  props: GuestCompareModeBadgeComponentProps,
) {
  function changeCompareMode() {
    if (!props.isCompareMode)
      copyImageToCompareCanvasForGuestMode(props.roomInfo);
    props.setIsCompareMode(!props.isCompareMode);
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
          <span className={'text-2xl'}>내 그림</span>
        </div>
        <div className={props.buttonStyle} onClick={changeCompareMode}>
          <span className={'font-bold'}>첨삭본과 비교하기&nbsp;</span>
          <i className='ri-arrow-go-back-line'></i>
        </div>
      </div>
    </div>
  );
}

export default GuestCompareModeBadgeComponent;
