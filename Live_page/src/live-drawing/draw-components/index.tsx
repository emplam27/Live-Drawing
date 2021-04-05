import React, { useState, useEffect } from 'react';

// components
// import AddImageComponent from './components/AddImageComponent';
// import DeleteObjectComponent from './components/DeleteObjectComponent';
// import CursorToolComponent from './components/CursorToolComponent';
import CloseButtonComponent from './components/CloseButtonComponent';
import ClosedFilterComponent from './components/ClosedFilterComponent';
import ColorPaletteComponent from './components/ColorPaletteComponent';
import CursorComponent from './components/CursorComponent';
import EraseSizeComponent from './components/EraseSizeComponent';
import LayerComponent from './components/LayerComponent';
import LineSizeComponent from './components/LineSizeComponent';
import ToolSelectComponent from './components/ToolSelectComponent';
// import UndoRedoComponent from './components/UndoRedoComponent';

import { draw, erase } from './functions/draw-functions';
import {
  CanvasCtxTable,
  Layer,
  DrawProps,
  DrawData,
  EraseData,
} from '../interfaces/draw-components-interfaces';
import './index.css';

function Draw(props: DrawProps) {
  //@ Drawing's States
  const [activeTool, setActiveTool] = useState<string>('');
  const [topLayer, setTopLayer] = useState<Layer | null>(null);
  const [canvasCtxTable, setCanvasCtxTable] = useState<CanvasCtxTable>({});
  const [layers, setLayers] = useState<Layer[]>([]);
  const [color, setColor] = useState('#000000');
  const [cursorWidth, setCursorWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(30);
  const [lineWidth, setLineWidth] = useState(5);
  const [isLiveClosed, setIsLiveClosed] = useState<boolean>(false);

  //@ Connection's States
  const [isHost, setIsHost] = useState<boolean | null>(null);
  const [pencilSignal, setPencilSignal] = useState<DrawData | null>(null);
  const [eraserSignal, setEraserSignal] = useState<EraseData | null>(null);
  const [newLayerCtxSignal, setNewLayerCtxSignal] = useState<number | null>(
    null,
  );

  /*
   * ========================================================
   * ========================================================
   */

  //@ Function: Socket Connect Init
  useEffect(() => {
    if (props.socket) {
      props.socket.on('draw-pencil', (message: DrawData) =>
        setPencilSignal(message),
      );
      props.socket.on('draw-eraser', (message: EraseData) =>
        setEraserSignal(message),
      );
    }
  }, [props.socket]);

  //@ Function: Recieve Pencil Event
  useEffect(() => {
    if (pencilSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[pencilSignal.canvasId];
    draw(pencilSignal, canvasCtx);
  }, [pencilSignal]);

  //@ Function: Recieve Eraser Event
  useEffect(() => {
    if (eraserSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[eraserSignal.canvasId];
    erase(eraserSignal, canvasCtx);
  }, [eraserSignal]);

  /*
   * ========================================================
   * ========================================================
   */

  return (
    <div className='drawComponent'>
      <ClosedFilterComponent
        isLiveClosed={isLiveClosed}
        setIsLiveClosed={setIsLiveClosed}
      />
      <CursorComponent cursorWidth={cursorWidth} />
      <div className='flush vstack'>
        <div className='menubar hstack'>
          <div className='spacer'></div>
          {/* <CursorToolComponent
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            setCursorWidth={setCursorWidth}
          />
          <DeleteObjectComponent canvas={canvas} />
          <AddImageComponent canvas={canvas} />
          <div className='spacer'></div> */}

          <ToolSelectComponent
            activeTool={activeTool}
            color={color}
            eraserWidth={eraserWidth}
            lineWidth={lineWidth}
            setActiveTool={setActiveTool}
            setCursorWidth={setCursorWidth}
          />
          {/* <UndoRedoComponent
            canvas={canvas}
            peerConnectionContext={peerConnectionContext}
          /> */}
          {activeTool !== 'eraser' ? (
            <LineSizeComponent
              activeTool={activeTool}
              cursorWidth={cursorWidth}
              lineWidth={lineWidth}
              setCursorWidth={setCursorWidth}
              setLineWidth={setLineWidth}
            />
          ) : (
            <EraseSizeComponent
              activeTool={activeTool}
              cursorWidth={cursorWidth}
              eraserWidth={eraserWidth}
              setCursorWidth={setCursorWidth}
              setEraserWidth={setEraserWidth}
            />
          )}

          <div className='spacer'></div>
          <ColorPaletteComponent color={color} setColor={setColor} />
          <div className='spacer'></div>

          <CloseButtonComponent
            roomInfo={props.roomInfo}
            setIsLiveClosed={setIsLiveClosed}
          />
        </div>
        <LayerComponent
          activeTool={activeTool}
          topLayer={topLayer}
          canvasCtxTable={canvasCtxTable}
          color={color}
          roomInfo={props.roomInfo}
          eraserWidth={eraserWidth}
          layers={layers}
          lineWidth={lineWidth}
          newLayerCtxSignal={newLayerCtxSignal}
          roomUsers={props.roomUsers}
          socket={props.socket}
          setTopLayer={setTopLayer}
          setCanvasCtxTable={setCanvasCtxTable}
          setLayers={setLayers}
          setNewLayerCtxSignal={setNewLayerCtxSignal}
        />
      </div>
    </div>
  );
}

export default Draw;
