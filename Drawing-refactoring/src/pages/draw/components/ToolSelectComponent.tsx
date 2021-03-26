import React, { useEffect } from 'react';
import '../index.css';
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
    props.setActiveTool(tool.name);
    if (tool.name === 'pencil') {
      props.setCursorWidth(props.lineWidth);
    } else if (tool.name === 'eraser') {
      props.setCursorWidth(props.eraserWidth);
    }
  }

  // useEffect(() => {
  // console.log(activeTool);
  // }, [props.activeTool]);

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
              props.activeTool === tool.name ? 'active' : ''
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
