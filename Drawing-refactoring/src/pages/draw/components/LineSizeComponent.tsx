import React from 'react';
import '../index.css';

interface LineSizeComponentProps {
  lineWidth: number;
  cursorWidth: number;
  setLineWidth: any;
  setCursorWidth: any;
}

function LineSizeComponent({
  lineWidth,
  cursorWidth,
  setLineWidth,
  setCursorWidth,
}: LineSizeComponentProps) {
  function changeLineSize(e: any) {
    setLineWidth(e.target.value);
    setCursorWidth(e.target.value);
  }

  return (
    <>
      <input
        id='pencilSlider'
        type='range'
        min='5'
        max='100'
        value={lineWidth}
        onChange={changeLineSize}
      />
      {lineWidth}
    </>
  );
}

export default LineSizeComponent;
