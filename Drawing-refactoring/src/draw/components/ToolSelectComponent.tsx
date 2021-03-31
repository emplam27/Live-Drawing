import React, { useEffect } from 'react';

import {
  ToolSelectComponentProps,
  Tool,
} from '../interfaces/tool-select-interfaces';
import '../index.css';
// import { fabric } from 'fabric';
const fabric = require('fabric').fabric;

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
    fabric.Object.prototype.objectCaching = false;
    props.setActiveTool(tool.name);
    if (!props.canvas) return;

    let brush;
    switch (tool.name) {
      case 'pencil':
        // console.log('pencil');
        props.canvas.isDrawingMode = true;
        brush = new fabric.PencilBrush();
        props.canvas.freeDrawingBrush = brush;
        props.canvas.freeDrawingBrush.canvas = props.canvas;
        props.canvas.freeDrawingBrush.color = props.color;
        props.canvas.freeDrawingBrush.opacity = 1;
        props.canvas.freeDrawingBrush.width = props.lineWidth;
        // console.log(props.canvas.freeDrawingBrush);
        props.setCursorWidth(props.lineWidth);
        break;

      // case 'spray':
      //   // console.log('spray');
      //   props.canvas.isDrawingMode = true;
      //   brush = new fabric.SprayBrush();
      //   props.canvas.freeDrawingBrush = brush;
      //   props.canvas.freeDrawingBrush.canvas = props.canvas;
      //   props.canvas.freeDrawingBrush.color = props.color;
      //   props.canvas.freeDrawingBrush.opacity = 1;
      //   props.canvas.freeDrawingBrush.width = props.lineWidth;
      //   props.setCursorWidth(props.lineWidth);
      //   // console.log(props.canvas.freeDrawingBrush);
      //   break;

      // case 'bubble':
      //   // console.log('bubble');
      //   props.canvas.isDrawingMode = true;
      //   brush = new fabric.CircleBrush();
      //   props.canvas.freeDrawingBrush = brush;
      //   props.canvas.freeDrawingBrush.canvas = props.canvas;
      //   props.canvas.freeDrawingBrush.color = props.color;
      //   props.canvas.freeDrawingBrush.opacity = 1;
      //   props.canvas.freeDrawingBrush.width = props.lineWidth;
      //   props.setCursorWidth(props.lineWidth);
      //   // console.log(props.canvas.freeDrawingBrush);
      //   break;

      // case 'crayon':
      //   // console.log('crayon');
      //   props.canvas.isDrawingMode = true;
      //   brush = new fabric.CrayonBrush(props.canvas, {});
      //   props.canvas.freeDrawingBrush = brush;
      //   props.canvas.freeDrawingBrush.canvas = props.canvas;
      //   props.canvas.freeDrawingBrush.color = props.color;
      //   props.canvas.freeDrawingBrush.opacity = 1;
      //   props.canvas.freeDrawingBrush.width = props.lineWidth;
      //   props.setCursorWidth(props.lineWidth);
      //   // console.log(props.canvas.freeDrawingBrush);
      //   break;

      // case 'marker':
      //   // console.log('marker');
      //   props.canvas.isDrawingMode = true;
      //   brush = new fabric.MarkerBrush(props.canvas, {});
      //   props.canvas.freeDrawingBrush = brush;
      //   props.canvas.freeDrawingBrush.canvas = props.canvas;
      //   props.canvas.freeDrawingBrush.color = props.color;
      //   props.canvas.freeDrawingBrush.opacity = 1;
      //   props.canvas.freeDrawingBrush.width = props.lineWidth;
      //   props.setCursorWidth(props.lineWidth);
      //   // console.log(props.canvas.freeDrawingBrush);
      //   break;

      // case 'ink':
      //   // console.log('ink');
      //   props.canvas.isDrawingMode = true;
      //   brush = new fabric.InkBrush(props.canvas, {});
      //   props.canvas.freeDrawingBrush = brush;
      //   props.canvas.freeDrawingBrush.canvas = props.canvas;
      //   props.canvas.freeDrawingBrush.color = props.color;
      //   props.canvas.freeDrawingBrush.opacity = 1;
      //   props.canvas.freeDrawingBrush.width = props.lineWidth;
      //   props.setCursorWidth(props.lineWidth);
      //   // console.log(props.canvas.freeDrawingBrush);
      //   break;

      case 'eraser':
        // console.log('eraser');
        props.canvas.isDrawingMode = true;
        brush = new fabric.PencilBrush();
        props.canvas.freeDrawingBrush = brush;
        props.canvas.freeDrawingBrush.canvas = props.canvas;
        props.canvas.freeDrawingBrush.color = '#ff0000';
        props.canvas.freeDrawingBrush.opacity = 1;
        props.canvas.freeDrawingBrush.width = props.eraserWidth;
        props.canvas.contextContainer.globalCompositeOperation =
          'destination-out';
        props.canvas.contextCache.globalCompositeOperation = 'destination-out';
        // console.log(props.canvas);
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
