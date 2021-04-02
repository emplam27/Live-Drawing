import React from 'react';
import {
  ToolSelectComponentProps,
  Tool,
} from '../interfaces/tool-select-interfaces';
import '../index.css';

function ToolSelectComponent(props: ToolSelectComponentProps) {
  const Tools: Tool[] = [
    // {
    //   name: 'cursor',
    //   iconClass: 'ri-cursor-line',
    // },
    {
      name: 'pencil',
      iconClass: 'ri-pencil-line',
    },
    // {
    //   name: 'spray',
    //   iconClass: 'ri-brush-line',
    // },
    // {
    //   name: 'bubble',
    //   iconClass: 'ri-bubble-chart-line',
    // },
    // {
    //   name: 'crayon',
    //   iconClass: 'ri-edit-2-line',
    // },
    // {
    //   name: 'marker',
    //   iconClass: 'ri-mark-pen-line',
    // },
    // {
    //   name: 'ink',
    //   iconClass: 'ri-ink-bottle-fill',
    // },
    {
      name: 'eraser',
      iconClass: 'ri-eraser-line',
    },
    // {
    //   name: 'undo',
    //   iconClass: 'ri-arrow-go-back-line',
    // },
  ];

  function changeActiveTool(tool: Tool): void {
    props.setActiveTool(tool.name);

    switch (tool.name) {
      case 'pencil':
        // props.canvas.isDrawingMode = true;
        // brush = new fabric.PencilBrush();
        // props.canvas.freeDrawingBrush = brush;
        // props.canvas.freeDrawingBrush.canvas = props.canvas;
        // props.canvas.freeDrawingBrush.color = props.color;
        // props.canvas.freeDrawingBrush.opacity = 1;
        // props.canvas.freeDrawingBrush.width = props.lineWidth;
        props.setCursorWidth(props.lineWidth);
        break;

      case 'eraser':
        // console.log('eraser');
        // props.canvas.isDrawingMode = true;
        // brush = new fabric.PencilBrush();
        // props.canvas.freeDrawingBrush = brush;
        // props.canvas.freeDrawingBrush.canvas = props.canvas;
        // props.canvas.freeDrawingBrush.color = '#ffffff';
        // props.canvas.freeDrawingBrush.opacity = 1;
        // props.canvas.freeDrawingBrush.width = props.eraserWidth;
        // props.canvas.contextContainer.globalCompositeOperation =
        //   'destination-out';
        // props.canvas.contextCache.globalCompositeOperation = 'destination-out';
        props.setCursorWidth(props.eraserWidth);
        break;
    }
  }

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
            onClick={() => changeActiveTool(tool)}
          >
            <i className={`ri-2x ${tool.iconClass}`}></i>
          </p>
        );
      })}
    </>
  );
}

export default ToolSelectComponent;
