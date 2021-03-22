import React, { useState, useEffect, useRef } from 'react';
import { down, move, up, key, forceChanged } from '../../../functions/draw';
import '../index.css';

interface EraseSizeComponentProps {
  cursorWidth: number;
  setEraserWidth: any;
  setCursorWidth: any;
}

function EraseSizeComponent({ cursorWidth, setEraserWidth, setCursorWidth }: EraseSizeComponentProps) {
  function changeEraserSize(e: any) {
    setEraserWidth(e.target.value);

    // setCursorWidth(val.target.value)

    // eraserWidth = val.target.value
    // console.log('eraserwidth', eraserWidth)
    // console.log('cursorwidth', cursorWidth)
  }

  function changeCursorSize(e: any) {
    setCursorWidth(e.target.value);
  }

  return (
    <>
      <input
        id='eraseSlider'
        type='range'
        min='5'
        max='100'
        value='5'
        onMouseUp={changeEraserSize}
        onChange={changeCursorSize}
      />
      {cursorWidth}
    </>
  );
}

export default EraseSizeComponent;
