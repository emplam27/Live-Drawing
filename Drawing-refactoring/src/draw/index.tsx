import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import './index.css';

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

// interfaces
import { DrawData } from './functions/draw-interfaces';
import {
  CanvasCtxTable,
  Layer,
  Params,
  PeerConnectionContext,
} from './interfaces/index-interfaces';

import { DrawProps } from './interfaces/draw-props-interfaces';
import { draw, erase } from './functions/draw';
import {
  createLayerByCanvasId,
  deleteLayerByCanvasId,
} from './functions/layer-functions';

function Draw(props: DrawProps) {
  //@ Drawing's States
  const [activeTool, setActiveTool] = useState<string>('');
  const [activeLayer, setActiveLayer] = useState<Layer | null>(null);
  const [canvasCtxTable, setCanvasCtxTable] = useState<CanvasCtxTable>({});
  const [layers, setLayers] = useState<Layer[]>([]);
  const [layerCount, setLayerCount] = useState<number>(0);
  const [color, setColor] = useState('#000000');
  const [cursorWidth, setCursorWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(30);
  const [lineWidth, setLineWidth] = useState(5);
  const [isLiveClosed, setIsLiveClosed] = useState<boolean>(false);

  //@ Connection's States
  const [
    peerConnectionContext,
    setPeerConnectionContext,
  ] = useState<PeerConnectionContext>({
    username: `user-${uuid()}`,
    roomId: props.roomKey,
    token: null,
    eventSource: null,
    peers: {},
    channels: {},
    is_new: true,
    is_host: true,
    hostId: null,
  });
  const [drawHistory, setDrawHistory] = useState<DrawData[]>([]);
  // const [readyToDrawHistorySignal, setReadyToDrawHistorySignal] = useState<
  //   number | null
  // >(null);
  const [sendHistoryDataSignal, setSendHistoryDataSignal] = useState<
    number | null
  >(null);
  const [setHostSignal, setSetHostSignal] = useState<number | null>(null);
  const [closeLiveSignal, setCloseLiveSignal] = useState<number | null>(null);
  const [pencilSignal, setPencilSignal] = useState<any | null>(null);
  const [eraserSignal, setEraserSignal] = useState<any | null>(null);
  const [createLayerSignal, setCreateLayerSignal] = useState<any | null>(null);
  const [deleteLayerSignal, setDeleteLayerSignal] = useState<any | null>(null);
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
      props.socket.on('draw-pencil', (message: any) =>
        setPencilSignal(message),
      );
      props.socket.on('draw-eraser', (message: any) =>
        setEraserSignal(message),
      );
      props.socket.on('create-layer', (message: any) =>
        setCreateLayerSignal(message),
      );
      props.socket.on('delete-layer', (message: any) =>
        setDeleteLayerSignal(message),
      );
    }
  }, [props.socket]);

  //@ Function: Recieve Pencil Event
  useEffect(() => {
    if (pencilSignal === null) return;
    console.log('Function: Recieve Pencil Event');
    console.log(pencilSignal.canvasId);
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[pencilSignal.canvasId];
    console.log(canvasCtx);
    draw(pencilSignal, canvasCtx);
  }, [pencilSignal]);

  //@ Function: Recieve Eraser Event
  useEffect(() => {
    if (eraserSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[eraserSignal.canvasId];
    erase(eraserSignal, canvasCtx);
  }, [eraserSignal]);

  //@ Function: Recieve Create Layer Event
  useEffect(() => {
    if (createLayerSignal === null) return;
    // const canvasCtx: CanvasRenderingContext2D =
    //   canvasCtxTable[createLayerSignal.canvasId];
    // erase(createLayerSignal, canvasCtx);
    createLayerByCanvasId(
      createLayerSignal.canvasId,
      activeLayer,
      layers,
      setActiveLayer,
      setNewLayerCtxSignal,
      setLayers,
    );
  }, [createLayerSignal]);

  //@ Function: Recieve Delete Layer Event
  useEffect(() => {
    if (deleteLayerSignal === null) return;
    // const canvasCtx: CanvasRenderingContext2D =
    //   canvasCtxTable[deleteLayerSignal.canvasId];
    // erase(deleteLayerSignal, canvasCtx);
    deleteLayerByCanvasId(deleteLayerSignal.canvasId, layers, setActiveLayer);
  }, [deleteLayerSignal]);

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
            isHost={peerConnectionContext.is_host}
            setIsLiveClosed={setIsLiveClosed}
          />
        </div>
        <LayerComponent
          activeTool={activeTool}
          activeLayer={activeLayer}
          canvasCtxTable={canvasCtxTable}
          color={color}
          drawHistory={drawHistory}
          eraserWidth={eraserWidth}
          layerCount={layerCount}
          layers={layers}
          lineWidth={lineWidth}
          newLayerCtxSignal={newLayerCtxSignal}
          peerConnectionContext={peerConnectionContext}
          socket={props.socket}
          setActiveLayer={setActiveLayer}
          setCanvasCtxTable={setCanvasCtxTable}
          setDrawHistory={setDrawHistory}
          setLayerCount={setLayerCount}
          setLayers={setLayers}
          setNewLayerCtxSignal={setNewLayerCtxSignal}
        />
      </div>
    </div>
  );
}

export default Draw;
