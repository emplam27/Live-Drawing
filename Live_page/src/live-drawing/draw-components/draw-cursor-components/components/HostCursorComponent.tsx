import React, { useEffect, useRef } from 'react';
import { HostCursorComponentProps } from '../interfaces/host-cursor-interfaces';
import brush from './paint-cursor.png';

export function HostCursorComponent(props: HostCursorComponentProps) {
  if (!props.position || !props.position.canvas) return null;
  const rect = props.position.canvas.getBoundingClientRect();
  const revisionHeight =
    2.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
  return (
    <div
      className={`${
        props.position !== null ? 'fixed' : 'hidden'
      } border-2 border-black w-10 h-10 z-30`}
      style={{
        left: props.position.point
          ? `${rect.left + props.position.point.x}px`
          : 'auto',
        top: props.position.point
          ? `${rect.top + props.position.point.y - revisionHeight}px`
          : 'auto',
        // zIndex: 9999,
      }}
    >
      <img src={brush} />
    </div>
  );
}
