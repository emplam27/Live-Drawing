import React, { useEffect } from 'react';
import '../index.css';
import { LineSizeComponentProps } from '../interfaces/line-size-interfaces';

function LineSizeComponent(props: LineSizeComponentProps) {
  function changeLineSize(e: React.ChangeEvent<HTMLInputElement>): void {
    if (!props.canvas || !props.canvas) return;
    props.setLineWidth(Number(e.target.value));
    // props.setCursorWidth(Number(e.target.value));
  }

  useEffect(() => {
    if (!props.canvas) return;
    if (props.activeTool === 'pencil') {
      props.canvas.freeDrawingBrush.width = props.lineWidth;
      props.setCursorWidth(props.lineWidth);
    }
  }, [props.lineWidth]);

  return (
    <>
      <p className='icon-link center'>Size</p>
      <input
        id='pencilSlider'
        type='range'
        min='1'
        max='100'
        value={props.lineWidth}
        onChange={changeLineSize}
      />
      <p
        className='icon-link center'
        style={{ lineHeight: '40px', width: '16px' }}
      >
        {props.lineWidth}
      </p>
    </>
  );
}

export default LineSizeComponent;
