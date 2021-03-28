import React, { useState, useEffect } from 'react';
import { mouseDown, mouseMove, mouseUp, key } from '../../../functions/draw';
import '../index.css';
import { LayerComponentProps } from '../interfaces/layer-interfaces';
import { fabric } from 'fabric';

function LayerComponent(props: LayerComponentProps) {
  useEffect(() => {
    const canvas = new fabric.Canvas('canvas', {
      isDrawingMode: false,
      freeDrawingCursor: 'none',
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
          height={window.innerHeight * 0.8}
        ></canvas>
      </div>
    </>
  );
}

export default LayerComponent;
