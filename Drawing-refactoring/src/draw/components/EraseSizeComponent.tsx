import React, { useEffect } from 'react';
import '../index.css';
import { EraseSizeComponentProps } from '../interfaces/erase-size-interfaces';

function EraseSizeComponent(props: EraseSizeComponentProps) {
  function changeEraserSize(e: React.ChangeEvent<HTMLInputElement>): void {
    props.setEraserWidth(Number(e.target.value));
    // props.setCursorWidth(Number(e.target.value));
  }

  useEffect(() => {
    if (!props.canvas || props.activeTool !== 'eraser') return;
    props.canvas.freeDrawingBrush.width = props.eraserWidth;
    props.setCursorWidth(props.eraserWidth);
  }, [props.eraserWidth]);

  return (
    <>
      <p className='icon-link center'>Size</p>
      <input
        id='eraseSlider'
        type='range'
        min='1'
        max='100'
        value={props.eraserWidth}
        onChange={changeEraserSize}
      />
      <p className='icon-link center' style={{ width: '16px' }}>
        {props.eraserWidth}
      </p>
    </>
  );
}

export default EraseSizeComponent;
