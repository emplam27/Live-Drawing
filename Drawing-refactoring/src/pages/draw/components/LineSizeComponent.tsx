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
    if (
      props.activeTool === 'pencil' ||
      props.activeTool === 'spray' ||
      props.activeTool === 'bubble' ||
      props.activeTool === 'crayon' ||
      props.activeTool === 'marker' ||
      props.activeTool === 'ink'
    ) {
      props.canvas.freeDrawingBrush.width = props.lineWidth;
      props.setCursorWidth(props.lineWidth);
    }
  }, [props.lineWidth]);

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
