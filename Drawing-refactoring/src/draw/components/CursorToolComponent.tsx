import React, { useEffect } from 'react';

import {
  CursorToolComponentProps,
  Tool,
} from '../interfaces/cursor-tool-interfaces';
import '../index.css';
// import { fabric } from 'fabric';
const fabric = require('fabric').fabric;

function CursorToolComponent(props: CursorToolComponentProps) {
  function changeActiveTool(tool: Tool): void {
    fabric.Object.prototype.objectCaching = false;
    props.setActiveTool(tool.name);
    if (!props.canvas) return;
    props.canvas.isDrawingMode = false;
    props.setCursorWidth(0);
  }

  useEffect(() => {
    props.setActiveTool('cursor');
  }, []);

  return (
    <>
      <p
        id={'cursor'}
        className={`icon-link center ${
          props.activeTool === 'cursor' ? 'active' : ''
        }`}
        onClick={() =>
          changeActiveTool({
            name: 'cursor',
            iconClass: 'ri-cursor-line',
          })
        }
      >
        <i className={`ri-2x ri-cursor-line`}></i>
      </p>
    </>
  );
}

export default CursorToolComponent;
