import React, { useEffect } from 'react';
import '../index.css';
import { UndoRedoComponentProps } from '../interfaces/undo-redo-interfaces';
import { fabric } from 'fabric';

function UndoRedoComponent(props: UndoRedoComponentProps) {
  function undoHistory() {
    props.canvas.undo();
  }

  function redoHistory() {
    props.canvas.redo();
  }

  return (
    <>
      <p className={'icon-link center'} onClick={undoHistory}>
        <i className={'ri-xl ri-arrow-go-back-line'}></i>
      </p>
      <p className={'icon-link center'} onClick={redoHistory}>
        <i className={'ri-xl ri-arrow-go-forward-line'}></i>
      </p>
    </>
  );
}

export default UndoRedoComponent;
