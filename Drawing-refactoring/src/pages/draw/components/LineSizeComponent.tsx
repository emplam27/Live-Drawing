import React from 'react';
import '../index.css';
import { LineSizeComponentProps } from '../interfaces/line-size-interfaces';

function LineSizeComponent(props: LineSizeComponentProps) {
  function changeLineSize(e: React.ChangeEvent<HTMLInputElement>) {
    props.setLineWidth(Number(e.target.value));
    props.setCursorWidth(Number(e.target.value));
  }

  return (
    <>
      <input
        id='pencilSlider'
        type='range'
        min='5'
        max='100'
        value={props.lineWidth}
        onChange={changeLineSize}
      />
      {props.lineWidth}
    </>
  );
}

export default LineSizeComponent;
