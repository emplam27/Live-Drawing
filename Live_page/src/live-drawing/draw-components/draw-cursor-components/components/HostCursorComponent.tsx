import React, { useEffect, useRef } from 'react';
import { HostCursorComponentProps } from '../interfaces/host-cursor-interfaces';

export function HostCursorComponent(props: HostCursorComponentProps) {
  return (
    <div
      style={{
        left: props.point ? props.point.x + 'px' : 0,
        bottom: props.point ? props.point.y + 'px' : 0,
        width: '10px',
        height: '10px',
        border: '1px solid black',
        display: props.point ? 'block' : 'hidden',
      }}
    ></div>
  );
}
