import React from 'react';
import { UndoRedoComponentProps } from '../interfaces/undo-redo-interfaces';
import '../index.css';

function UndoRedoComponent(props: UndoRedoComponentProps) {
  function undoHistory(): void {
    // props.canvas.undo();
    // const message = {
    //   event: 'undo',
    //   timeStamp: new Date().getTime(),
    // };
    // broadcast(JSON.stringify(message), props.peerConnectionContext);
  }

  function redoHistory(): void {
    // props.canvas.redo();
    // const message = {
    //   event: 'redo',
    //   timeStamp: new Date().getTime(),
    // };
    // broadcast(JSON.stringify(message), props.peerConnectionContext);
  }

  return (
    <>
      <p className={'icon-link center'} onClick={undoHistory}>
        <i className={'ri-2x ri-arrow-go-back-line'}></i>
      </p>
      <p className={'icon-link center'} onClick={redoHistory}>
        <i className={'ri-2x ri-arrow-go-forward-line'}></i>
      </p>
    </>
  );
}

export default UndoRedoComponent;
