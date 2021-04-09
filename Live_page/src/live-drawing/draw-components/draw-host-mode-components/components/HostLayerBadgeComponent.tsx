import React from 'react';

import { HostLayerBadgeComponentProps } from '../interfaces/host-layer-badge-interfaces';

function HostLayerBadgeComponent(props: HostLayerBadgeComponentProps) {
  function startModifiedMode() {
    props.setIsModifiedMode(true);
  }

  function endModifiedMode() {
    props.setIsModifiedMode(false);
  }

  return (
    <>
      {!props.isModifiedMode ? (
        <div className={props.badgeStyle}>
          <div className={'flex items-end px-8'}>
            <span className={'font-bold text-3xl'}>
              {props.topLayer?.username}
            </span>
            <span className={'text-2xl'}>&nbsp;님의 그림</span>
          </div>
          <div className={props.buttonStyle} onClick={startModifiedMode}>
            <span className={'font-bold'}>그림첨삭 시작하기&nbsp;&nbsp;</span>
            <i className='ri-lg ri-pencil-line'></i>
          </div>
        </div>
      ) : (
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
      )}
    </>
  );
}

export default HostLayerBadgeComponent;
