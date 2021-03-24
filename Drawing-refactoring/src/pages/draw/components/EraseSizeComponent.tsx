import React from 'react';
import '../index.css';

interface EraseSizeComponentProps {
  eraserWidth: number;
  cursorWidth: number;
  setEraserWidth: any;
  setCursorWidth: any;
}

function EraseSizeComponent({
  eraserWidth,
  cursorWidth,
  setEraserWidth,
  setCursorWidth,
}: EraseSizeComponentProps) {
  function changeEraserSize(e: any) {
    setEraserWidth(e.target.value);
    setCursorWidth(e.target.value);
  }

  return (
    <>
      <input
        id='eraseSlider'
        type='range'
        min='5'
        max='100'
        value={eraserWidth}
        onChange={changeEraserSize}
      />
      {eraserWidth}
    </>
  );
}

export default EraseSizeComponent;
