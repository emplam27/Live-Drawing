import React, { useState, useEffect, useRef } from 'react';
import { down, move, up, key, forceChanged } from '../../../functions/draw';
import '../index.css';

interface LineSizeComponentProps {
  cursorWidth: number;
  setLineWidth: any;
  setCursorWidth: any;
}

function LineSizeComponent({ cursorWidth, setLineWidth, setCursorWidth }: LineSizeComponentProps) {
  const changeLineSize = (e: any) => {
    // lineWidth = val.target.value
    setLineWidth(e.target.value);
  };

  function changeCursorSize(e: any) {
    setCursorWidth(e.target.value);
  }
  return (
    <>
      <input
        id='pencilSlider'
        type='range'
        min='5'
        max='100'
        value='5'
        onMouseUp={changeLineSize}
        onChange={changeCursorSize}
      />
      {cursorWidth}
    </>
  );
}

export default LineSizeComponent;
