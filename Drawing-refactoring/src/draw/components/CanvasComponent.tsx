import React, { useState, useEffect } from 'react';
import { Message, CanvasComponentProps } from '../interfaces/canvas-interfaces';
import '../index.css';
import { broadcast } from '../../functions/draw';

const fabric = require('fabric').fabric;
require('fabric-history');

function CanvasComponent(props: CanvasComponentProps) {
  const [mouseUpSignal, setMouseUpSignal] = useState(null);

  useEffect(() => {
    if (mouseUpSignal === null) return;

    const message: Message = {
      event: null,
      tool: null,
      object: null,
    };
    switch (props.activeTool) {
      case 'pencil':
        message.event = 'object:added';
        message.tool = 'pencil';
        message.object = mouseUpSignal;
        break;

      case 'bubble':
        message.event = 'object:added';
        message.tool = 'bubble';
        message.object = mouseUpSignal;
        break;
    }

    broadcast(JSON.stringify(message), props.peerConnectionContext);
  }, [mouseUpSignal]);

  useEffect(() => {
    const canvas = new fabric.Canvas('canvas', {
      isDrawingMode: false,
      freeDrawingCursor: 'none',
      preserveObjectStacking: true,
    });
    canvas.on('mouse:up', function () {
      console.log('mouse:up');
      const canvasObject = canvas._objects;
      setMouseUpSignal(canvasObject[canvasObject.length - 1]);
    });
    props.setCanvas(canvas);
  }, []);

  return (
    <>
      <div id='canvasContainer' className='spacer app relative'>
        <canvas
          id={`canvas`}
          className={'layer'}
          width={window.innerWidth * 0.8}
          height={window.innerHeight - 64}
        ></canvas>
      </div>
    </>
  );
}

export default CanvasComponent;
