import React, { useEffect } from 'react';
import { EraseSizeComponentProps } from '../interfaces/erase-size-interfaces';
import '../index.css';

function EraseSizeComponent(props: EraseSizeComponentProps) {
  function changeEraserSize(e: React.ChangeEvent<HTMLInputElement>): void {
    props.setEraserWidth(Number(e.target.value));
  }

  useEffect(() => {
    if (props.activeTool !== 'eraser') return;
    props.setCursorWidth(props.eraserWidth);
  }, [props.eraserWidth]);

  return (
    <>
      <p className='hover:text-blue-500 flex items-center'>Size</p>
      <input
        id='eraseSlider'
        className='cursor-pointer'
        type='range'
        min='1'
        max='100'
        value={props.eraserWidth}
        onChange={changeEraserSize}
      />
      <p
        className='hover:text-blue-500 flex items-center'
        style={{ width: '16px' }}
      >
        {props.eraserWidth}
      </p>
    </>
  );
}

export default EraseSizeComponent;
