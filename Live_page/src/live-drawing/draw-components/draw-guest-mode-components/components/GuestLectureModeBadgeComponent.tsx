import React from 'react';

import { Layer } from '../../../interfaces/draw-components-interfaces';
import { GuestLectureModeBadgeComponentProps } from '../interfaces/guest-lecture-mode-badge-interfaces';

function GuestLectureModeBadgeComponent(
  props: GuestLectureModeBadgeComponentProps,
) {
  function moveToHostLayer() {
    const hostLayer = props.layers.find((layer: Layer) => {
      return layer.canvasId === props.roomInfo.roomHostId;
    });
    if (hostLayer) props.setTopLayer(hostLayer);
  }

  return (
    <>
      <div
        className={`
          ${props.badgeContainerStyle}
          ${props.displayHidden ? 'hidden' : ''}
        `}
      >
        {props.topLayer?.canvasId === props.roomInfo.roomHostId ? (
          <div className={props.badgeStyle}>
            <div className={'flex items-end px-8'}>
              <span className={'font-bold text-3xl'}>
                {props.topLayer?.username}
              </span>
              <span className={'text-2xl'}>&nbsp;선생님의 그림</span>
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
            <div className={props.buttonStyle} onClick={moveToHostLayer}>
              <span className={'font-bold'}>
                선생님의 그림으로 돌아가기&nbsp;
              </span>
              <i className='ri-arrow-go-back-line'></i>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default GuestLectureModeBadgeComponent;
