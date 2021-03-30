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
      <input
        id='eraseSlider'
        type='range'
        min='5'
        max='100'
        value={props.eraserWidth}
        onChange={changeEraserSize}
      />
      {props.eraserWidth}
    </>
  );
}

export default EraseSizeComponent;
