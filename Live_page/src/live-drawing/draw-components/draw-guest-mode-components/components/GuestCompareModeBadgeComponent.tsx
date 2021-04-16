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
  const toggleButtonStyle =
    'flex items-center px-6 h-full text-xl text-white rounded-full cursor-pointer';
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
        {!props.isCompareMode ? (
          <div
            className={`${toggleButtonStyle} bg-blue-500 hover:bg-blue-400`}
            onClick={changeCompareMode}
          >
            <span className={'font-bold'}>첨삭본과 비교하기&nbsp;</span>
            <i className='ri-arrow-go-back-line'></i>
          </div>
        ) : (
          <div
            className={`${toggleButtonStyle} bg-blue-700 hover:bg-blue-600`}
            onClick={changeCompareMode}
          >
            <span className={'font-bold'}>내 그림으로 돌아가기&nbsp;</span>
            <i className='ri-arrow-go-back-line'></i>
          </div>
        )}
      </div>
    </div>
  );
}

export default GuestCompareModeBadgeComponent;
