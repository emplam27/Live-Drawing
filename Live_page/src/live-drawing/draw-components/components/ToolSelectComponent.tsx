import React, { useEffect } from 'react';

import {
  ToolSelectComponentProps,
  Tool,
} from '../interfaces/tool-select-interfaces';

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
            className={`hover:text-blue-500 px-2 flex items-center cursor-pointer
            ${
              props.activeTool === tool.name
                ? 'border-b-4 border-blue-500 text-blue-500'
                : ''
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
