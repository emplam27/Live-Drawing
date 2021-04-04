import React, { useEffect } from 'react';
import {
  ToolSelectComponentProps,
  Tool,
} from '../interfaces/tool-select-interfaces';
import '../index.css';

function ToolSelectComponent(props: ToolSelectComponentProps) {
  const Tools: Tool[] = [
    {
      name: 'pencil',
      iconClass: 'ri-pencil-line',
    },
    {
      name: 'eraser',
      iconClass: 'ri-eraser-line',
    },
  ];

  function changeActiveTool(toolName: string): void {
    props.setActiveTool(toolName);

    switch (toolName) {
      case 'pencil':
        props.setCursorWidth(props.lineWidth);
        break;

      case 'eraser':
        props.setCursorWidth(props.eraserWidth);
        break;
    }
  }

  useEffect(() => {
    changeActiveTool('pencil');
  }, []);

  return (
    <>
      {Tools.map((tool) => {
        return (
          <p
            key={tool.name}
            id={tool.name}
            className={`icon-link center ${
              props.activeTool === tool.name ? 'active' : ''
            }`}
            onClick={() => changeActiveTool(tool.name)}
          >
            <i className={`ri-2x ${tool.iconClass}`}></i>
          </p>
        );
      })}
    </>
  );
}

export default ToolSelectComponent;
