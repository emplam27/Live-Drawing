import React, { useEffect } from 'react';
import {
  CursorToolComponentProps,
  Tool,
} from '../interfaces/cursor-tool-interfaces';
import '../index.css';

function CursorToolComponent(props: CursorToolComponentProps) {
  function changeActiveTool(tool: Tool): void {
    props.setActiveTool(tool.name);
    props.setCursorWidth(0);
  }

  useEffect(() => {
    props.setActiveTool('cursor');
  }, []);

  return (
    <>
      <p
        id={'cursor'}
        className={`hover:text-blue-500 flex items-center ${
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
