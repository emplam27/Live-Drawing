import React, { useEffect } from 'react';
import '../index.css';

interface ToolSelectComponentProps {
  activeTool: string;
  lineWidth: number;
  eraserWidth: number;
  setCursorWidth: any;
  setActiveTool: any;
}

interface Tool {
  name: string;
  iconClass: string;
}

function ToolSelectComponent({
  lineWidth,
  eraserWidth,
  setCursorWidth,
  activeTool,
  setActiveTool,
}: ToolSelectComponentProps) {
  const Tools: Tool[] = [
    {
      name: 'pencil',
      iconClass: 'ri-pencil-line',
    },
    {
      name: 'rect',
      iconClass: 'ri-shape-line',
    },
    {
      name: 'circle',
      iconClass: 'ri-checkbox-blank-circle-line',
    },
    {
      name: 'text',
      iconClass: 'ri-font-size-2',
    },
    {
      name: 'layer',
      iconClass: 'ri-stack-line',
    },
    {
      name: 'eraser',
      iconClass: 'ri-eraser-line',
    },
    {
      name: 'paint',
      iconClass: 'ri-paint-fill',
    },
    {
      name: 'undo',
      iconClass: 'ri-arrow-go-back-line',
    },
  ];

  function changeActiveTool(tool: Tool) {
    setActiveTool(tool.name);
    if (tool.name === 'pencil') {
      setCursorWidth(lineWidth);
    } else if (tool.name === 'eraser') {
      setCursorWidth(eraserWidth);
    }
  }

  useEffect(() => {
    // console.log(activeTool);
  }, [activeTool]);

  return (
    <>
      <p className='icon-link center'>
        <i className='ri-lg ri-landscape-line'></i>
      </p>
      <div className='spacer'></div>

      {Tools.map((tool) => {
        return (
          <p
            key={tool.name}
            id={tool.name}
            className={`icon-link center ${
              activeTool === tool.name ? 'active' : ''
            }`}
            onClick={() => changeActiveTool(tool)}
          >
            <i className={`ri-xl ${tool.iconClass}`}></i>
          </p>
        );
      })}
    </>
  );
}

export default ToolSelectComponent;
