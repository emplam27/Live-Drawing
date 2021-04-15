import React, { useEffect, useRef } from 'react';
import { HostCursorComponentProps } from '../interfaces/host-cursor-interfaces';

export function HostCursorComponent(props: HostCursorComponentProps) {
  if (!props.position || !props.position.canvas) return null;
  const rect = props.position.canvas.getBoundingClientRect();
  const revisionHeight =
    3 * parseFloat(getComputedStyle(document.documentElement).fontSize);
  return (
    <div
      className={`${
        props.position !== null ? 'fixed' : 'hidden'
      } w-12 h-12 z-10`}
      style={{
        left: props.position.point
          ? `${rect.left + props.position.point.x}px`
          : 'auto',
        top: props.position.point
          ? `${rect.top + props.position.point.y - revisionHeight}px`
          : 'auto',
      }}
    >
      <svg
        x='0px'
        y='0px'
        viewBox='0 0 24 24'
        //  style="enable-background:new 0 0 24 24;"
        //  xml:space="preserve"
        fill='#2563EB'
      >
        <path
          d='M6.9,14c-0.2,0.6-0.4,1.2-0.6,1.8c1-0.7,2.1-1.1,3.4-1.3c2.5-0.3,4.7-2,5.9-4.1L14.2,9l1.4-1.4l1-1C17,6.2,17.5,5.4,18,4.2
	C12.4,5.1,9,8.5,6.9,14L6.9,14z M17,9l1,1c-1,3-4,6-8,6.5c-2.7,0.3-4.3,2.2-5,5.5H3C4,16,6,2,21,2c-1,3-2,5-3,6L17,9z'
        />
      </svg>
    </div>
  );
}
