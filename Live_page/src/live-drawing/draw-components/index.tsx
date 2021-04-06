import React, { useState, useEffect } from 'react';

// components
// import AddImageComponent from './components/AddImageComponent';
// import DeleteObjectComponent from './components/DeleteObjectComponent';
// import CursorToolComponent from './components/CursorToolComponent';
import CursorComponent from './components/CursorComponent';
import LayerComponent from './components/LayerComponent';
// import UndoRedoComponent from './components/UndoRedoComponent';

import { draw, erase } from './functions/draw-functions';
import {
  CanvasCtxTable,
  Layer,
  DrawComponentProps,
  DrawData,
  EraseData,
} from '../interfaces/draw-components-interfaces';
import './index.css';

function DrawComponent(props: DrawComponentProps) {
  //@ Drawing's States
  const [cursorWidth, setCursorWidth] = useState(5);
  const [canvasCtxTable, setCanvasCtxTable] = useState<CanvasCtxTable>({});

  //@ Connection's States
  const [pencilSignal, setPencilSignal] = useState<DrawData | null>(null);
  const [eraserSignal, setEraserSignal] = useState<EraseData | null>(null);
  const [newLayerCtxSignal, setNewLayerCtxSignal] = useState<number | null>(
    null,
  );

  //@ Function: Socket Connect Init
  useEffect(() => {
    if (!props.socket) return;
    props.socket.on('draw-pencil', (message: DrawData) =>
      setPencilSignal(message),
    );
    props.socket.on('draw-eraser', (message: EraseData) =>
      setEraserSignal(message),
    );
  }, [props.socket]);

  //@ Function: Recieve Pencil Event
  useEffect(() => {
    if (pencilSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[pencilSignal.canvasId];
    if (!canvasCtx) return;
    draw(pencilSignal, canvasCtx);
  }, [pencilSignal]);

  //@ Function: Recieve Eraser Event
  useEffect(() => {
    if (eraserSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[eraserSignal.canvasId];
    if (!canvasCtx) return;
    erase(eraserSignal, canvasCtx);
  }, [eraserSignal]);

  return (
    <>
      <CursorComponent cursorWidth={cursorWidth} />
      <LayerComponent
        topLayer={props.topLayer}
        canvasCtxTable={canvasCtxTable}
        cursorWidth={cursorWidth}
        layers={props.layers}
        newLayerCtxSignal={newLayerCtxSignal}
        roomInfo={props.roomInfo}
        roomUsers={props.roomUsers}
        socket={props.socket}
        setTopLayer={props.setTopLayer}
        setCanvasCtxTable={setCanvasCtxTable}
        setCursorWidth={setCursorWidth}
        setLayers={props.setLayers}
        setNewLayerCtxSignal={setNewLayerCtxSignal}
      />
    </>
  );
}

export default DrawComponent;
