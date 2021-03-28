import React, { useEffect } from 'react';
import {
  ToolSelectComponentProps,
  Tool,
} from '../interfaces/tool-select-interfaces';
import '../index.css';
import { fabric } from 'fabric';
// const fabric = require('fabric').fabric;

function ToolSelectComponent(props: ToolSelectComponentProps) {
  const Tools: Tool[] = [
    {
      name: 'cursor',
      iconClass: 'ri-cursor-line',
    },
    {
      name: 'pencil',
      iconClass: 'ri-pencil-line',
    },
    {
      name: 'spray',
      iconClass: 'ri-brush-line',
    },
    {
      name: 'circle',
      iconClass: 'ri-checkbox-blank-circle-line',
    },
    {
      name: 'crayon',
      iconClass: 'ri-edit-2-line',
    },
    // {
    //   name: 'layer',
    //   iconClass: 'ri-stack-line',
    // },
    {
      name: 'eraser',
      iconClass: 'ri-eraser-line',
    },
    // {
    //   name: 'paint',
    //   iconClass: 'ri-paint-fill',
    // },
    // {
    //   name: 'undo',
    //   iconClass: 'ri-arrow-go-back-line',
    // },
  ];

  function changeActiveTool(tool: Tool) {
    props.setActiveTool(tool.name);
    if (!props.canvas) return;

    let brush;
    switch (tool.name) {
      case 'cursor':
        console.log('cursor');
        props.canvas.isDrawingMode = false;
        props.setCursorWidth(5);
        break;

      case 'pencil':
        console.log('pencil');
        props.canvas.isDrawingMode = true;
        brush = new fabric.PencilBrush();
        console.log(fabric);
        props.canvas.freeDrawingBrush = brush;
        props.canvas.freeDrawingBrush.canvas = props.canvas;
        props.canvas.freeDrawingBrush.color = props.color;
        props.canvas.freeDrawingBrush.opacity = 1;
        props.canvas.freeDrawingBrush.width = props.lineWidth;
        console.log(props.canvas.freeDrawingBrush);
        props.setCursorWidth(props.lineWidth);
        break;

      case 'eraser':
        console.log('eraser');
        props.canvas.isDrawingMode = false;
        props.setCursorWidth(props.eraserWidth);
        break;
      case 'spray':
        console.log('spray');
        props.canvas.isDrawingMode = true;
        brush = new fabric.SprayBrush();
        props.canvas.freeDrawingBrush = brush;
        props.canvas.freeDrawingBrush.canvas = props.canvas;
        props.canvas.freeDrawingBrush.color = props.color;
        props.canvas.freeDrawingBrush.opacity = 1;
        props.canvas.freeDrawingBrush.width = props.lineWidth;
        props.setCursorWidth(props.lineWidth);
        console.log(props.canvas.freeDrawingBrush);
        break;

      case 'circle':
        console.log('circle');
        props.canvas.isDrawingMode = true;
        brush = new fabric.CircleBrush();
        props.canvas.freeDrawingBrush = brush;
        props.canvas.freeDrawingBrush.canvas = props.canvas;
        props.canvas.freeDrawingBrush.color = props.color;
        props.canvas.freeDrawingBrush.opacity = 1;
        props.canvas.freeDrawingBrush.width = props.lineWidth;
        props.setCursorWidth(props.lineWidth);
        console.log(props.canvas.freeDrawingBrush);
        break;

      // case 'crayon':
      //   console.log('crayon');
      //   props.canvas.isDrawingMode = true;
      //   brush = new fabric.CrayonBrush(props.canvas, {});
      //   props.canvas.freeDrawingBrush = brush;
      //   props.canvas.freeDrawingBrush.canvas = props.canvas;
      //   props.canvas.freeDrawingBrush.color = props.color;
      //   props.canvas.freeDrawingBrush.opacity = 0.6;
      //   props.canvas.freeDrawingBrush.width = props.lineWidth;
      //   props.setCursorWidth(props.lineWidth);
      //   console.log(props.canvas.freeDrawingBrush);
      //   break;
    }
  }

  useEffect(() => {
    props.setActiveTool('cursor');
  }, []);

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
