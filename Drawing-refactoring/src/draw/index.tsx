import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

import {
  getToken,
  onPeerData,
  addPeer,
  removePeer,
  sessionDescription,
  iceCandidate,
  joinRoom,
  sendHistoryData,
  setHost,
  closeLive,
} from './functions/connect';
import { DrawProps } from './interfaces/draw-props-interfaces';
import { Socket } from 'socket.io-client';
import { draw, erase } from './functions/draw';

function Draw(props: DrawProps) {
  //@ Connection's States
  // const rtcConfig = {
  //   iceServers: [
  //     {
  //       urls: [
  //         'stun:stun.l.google.com:19302',
  //         'stun:global.stun.twilio.com:3478',
  //       ],
  //     },
  //   ],
  // };
  // const { roomKey } = useParams<Params>();
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
  const [onPeerDataSignal, setOnPeerDataSignal] = useState<string | null>(null);
  const [drawHistory, setDrawHistory] = useState<DrawData[]>([]);
  // const [readyToDrawHistorySignal, setReadyToDrawHistorySignal] = useState<
  //   number | null
  // >(null);
  const [addPeerSignal, setAddPeerSignal] = useState<string | null>(null);
  const [removePeerSignal, setRemovePeerSignal] = useState<string | null>(null);
  const [sessionDescriptionSignal, setSessionDescriptionSignal] = useState<
    string | null
  >(null);
  const [iceCandidateSignal, setIceCandidateSignal] = useState<string | null>(
    null,
  );
  const [joinRoomSignal, setJoinRoomSignal] = useState<number | null>(null);
  const [sendHistoryDataSignal, setSendHistoryDataSignal] = useState<
    number | null
  >(null);
  const [setHostSignal, setSetHostSignal] = useState<number | null>(null);
  const [closeLiveSignal, setCloseLiveSignal] = useState<number | null>(null);

  //@ Drawing's States
  const [activeTool, setActiveTool] = useState<string>('');
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const [activeLayer, setActiveLayer] = useState<Layer | null>(null);
  const [canvasCtxTable, setCanvasCtxTable] = useState<CanvasCtxTable>({});
  const [layers, setLayers] = useState<Layer[]>([]);
  const [layerCount, setLayerCount] = useState<number>(0);
  // const [canvas, setCanvas] = useState<any>(null);
  //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  const [color, setColor] = useState('#000000');
  const [cursorWidth, setCursorWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(30);
  const [lineWidth, setLineWidth] = useState(5);
  const [isLiveClosed, setIsLiveClosed] = useState<boolean>(false);

  /*
   * ========================================================
   * ========================================================
   */

  const [pencilSignal, setPencilSignal] = useState<any | null>(null);
  const [eraserSignal, setEraserSignal] = useState<any | null>(null);
  useEffect(() => {
    if (props.socket) {
      props.socket.on('draw-pencil', (message: any) =>
        setPencilSignal(message),
      );
      props.socket.on('draw-eraser', (message: any) =>
        setEraserSignal(message),
      );
    }
  }, [props.socket]);
  useEffect(() => {
    if (pencilSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[pencilSignal.canvasId];
    draw(pencilSignal, canvasCtx);
  }, [pencilSignal]);
  useEffect(() => {
    if (eraserSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[eraserSignal.canvasId];
    erase(eraserSignal, canvasCtx);
  }, [eraserSignal]);

  // async function connectInit(): Promise<void> {
  //   // console.log('========= connect ==========');
  //   const token = await getToken(peerConnectionContext);
  //   const context = { ...peerConnectionContext };
  //   context.token = token;
  //   context.eventSource = new EventSource(
  //     `${process.env.REACT_APP_RTC_URL}/connect?token=${token}`,
  //   );

  //   context.eventSource.addEventListener(
  //     'add-peer',
  //     changeAddPeerSignal,
  //     false,
  //   );
  //   context.eventSource.addEventListener(
  //     'remove-peer',
  //     changeRemovePeerSignal,
  //     false,
  //   );
  //   context.eventSource.addEventListener(
  //     'session-description',
  //     changeSessionDescriptionSignal,
  //     false,
  //   );
  //   context.eventSource.addEventListener(
  //     'ice-candidate',
  //     changeIceCandidateSignal,
  //     false,
  //   );
  // context.eventSource.addEventListener('connected', changeJoinRoomSignal);
  // context.eventSource.addEventListener(
  //   'send-history-data',
  //   changeSendHistoryDataSignal,
  //   false,
  // );
  // context.eventSource.addEventListener('set-host', changeSetHostSignal, false);
  // context.eventSource.addEventListener(
  //   'close-live',
  //   changeCloseLiveSignal,
  //   false,
  // );
  // //   setPeerConnectionContext(context);
  // // }

  // /*
  //  * ========================================================
  //  * ========================================================
  //  */

  // //! data:any 수정
  // function changeOnPeerDataSignal(_: string, data: string): void {
  //   // console.log('changeOnPeerDataSignal');
  //   setOnPeerDataSignal(data);
  // }

  // //! data:any 수정
  // function changeAddPeerSignal(data: any): void {
  //   setAddPeerSignal(data.data);
  // }

  // //! data:any 수정
  // function changeRemovePeerSignal(data: any): void {
  //   // console.log('========= removePeer ==========');
  //   setRemovePeerSignal(data.data);
  // }

  // //! data:any 수정
  // function changeSessionDescriptionSignal(data: any): void {
  //   // console.log('========= sessionDescription ==========');
  //   setSessionDescriptionSignal(data.data);
  // }

  // //! data:any 수정
  // function changeIceCandidateSignal(data: any): void {
  //   // console.log('========= iceCandidate ==========');
  //   setIceCandidateSignal(data.data);
  // }

  // //! data:any 수정
  // function changeJoinRoomSignal(data: any): void {
  //   // console.log('========= join ==========');
  //   setJoinRoomSignal(data.timeStamp);
  // }

  // //! data:any 수정
  // function changeSendHistoryDataSignal(data: any): void {
  //   // console.log('========== sendHistoryData 이벤트는 들어오냐? ==========');
  //   setSendHistoryDataSignal(data.timeStamp);
  // }

  // //! data:any 수정
  // function changeSetHostSignal(data: any): void {
  //   // console.log('========== setHost ==========');
  //   setSetHostSignal(data.timeStamp);
  // }

  // //! data:any 수정
  // function changeCloseLiveSignal(data: any): void {
  //   // console.log('========== close live ==========');
  //   setCloseLiveSignal(data.timeStamp);
  // }

  // /*
  //  * ========================================================
  //  * ========================================================
  //  */

  // // //@ function: actionDrawHistory
  // // useEffect(() => {
  // //   if (!actionHistorySignal.length) return;
  // //   console.log('actionHistorySignal 을 받았다!');
  // //   // actionDrawHistory(actionHistorySignal, canvasCtxTable);
  // // }, [actionHistorySignal]);

  // //@ function: onPeerData
  // useEffect(() => {
  //   if (onPeerDataSignal === null || !activeLayer || !activeLayer.canvasCtx)
  //     return;
  //   // console.log('========= useEffect :: onPeerData ==========');
  //   // console.log(onPeerDataSignal === null);
  //   // console.log(!activeLayer);
  //   // console.log(!activeLayer?.canvasCtx);
  //   const message = JSON.parse(onPeerDataSignal);
  //   // console.log(message);
  //   onPeerData(message, canvasCtxTable);
  // }, [onPeerDataSignal]);

  // //@ function: addPeer
  // useEffect(() => {
  //   if (addPeerSignal === null) return;
  //   console.log('========= addPeer ==========');
  //   const message = JSON.parse(addPeerSignal);
  //   if (peerConnectionContext.peers[message.peer.id]) return;
  //   addPeer(
  //     message,
  //     peerConnectionContext,
  //     rtcConfig,
  //     changeOnPeerDataSignal,
  //     setPeerConnectionContext,
  //   );
  // }, [addPeerSignal]);

  // //@ function: removePeer
  // useEffect(() => {
  //   if (removePeerSignal === null) return;
  //   console.log('========= removePeer ==========');
  //   const message = JSON.parse(removePeerSignal);
  //   removePeer(message, peerConnectionContext, setPeerConnectionContext);
  // }, [removePeerSignal]);

  // //@ function: sessionDescription
  // useEffect(() => {
  //   if (sessionDescriptionSignal === null) return;
  //   // console.log('========= sessionDescription ==========');

  //   const message = JSON.parse(sessionDescriptionSignal);
  //   if (peerConnectionContext.token === null || !message) return;
  //   sessionDescription(message, peerConnectionContext);
  // }, [sessionDescriptionSignal]);

  // //@ function: iceCandidate
  // useEffect(() => {
  //   if (iceCandidateSignal === null) return;
  //   // console.log('========= iceCandidate ==========');
  //   const message = JSON.parse(iceCandidateSignal);
  //   iceCandidate(message, peerConnectionContext);
  // }, [iceCandidateSignal]);

  // //@ function: joinRoom
  // useEffect(() => {
  //   if (joinRoomSignal === null) return;
  //   console.log('========= join ==========');
  //   joinRoom(peerConnectionContext);
  // }, [joinRoomSignal]);

  // //@ function: sendHistoryData
  // useEffect(() => {
  //   if (sendHistoryDataSignal === null) return;
  //   // console.log('========= sendHistoryData ==========');
  //   if (!peerConnectionContext.is_host) return;
  //   // sendHistoryData(canvas, peerConnectionContext);
  // }, [sendHistoryDataSignal]);

  // //@ function: setHost
  // useEffect(() => {
  //   if (setHostSignal === null) return;
  //   console.log('========== setHost ==========');
  //   setHost(peerConnectionContext, setPeerConnectionContext);
  // }, [setHostSignal]);

  // //@ function: closeLive
  // useEffect(() => {
  //   if (closeLiveSignal === null) return;
  //   console.log('========== closeLive ==========');
  //   closeLive(setIsLiveClosed);
  // }, [closeLiveSignal]);

  // //@ function: connectInit
  // useEffect(() => {
  //   // connectInit();
  // }, []);

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
          peerConnectionContext={peerConnectionContext}
          socket={props.socket}
          setActiveLayer={setActiveLayer}
          setCanvasCtxTable={setCanvasCtxTable}
          setDrawHistory={setDrawHistory}
          setLayerCount={setLayerCount}
          setLayers={setLayers}
        />
      </div>
    </div>
  );
}

export default Draw;
