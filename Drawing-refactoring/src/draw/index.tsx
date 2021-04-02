import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import './index.css';

// components
import AddImageComponent from './components/AddImageComponent';
import DeleteObjectComponent from './components/DeleteObjectComponent';
import CursorToolComponent from './components/CursorToolComponent';
import CloseButtonComponent from './components/CloseButtonComponent';
import ClosedFilterComponent from './components/ClosedFilterComponent';
import ColorPaletteComponent from './components/ColorPaletteComponent';
import CursorComponent from './components/CursorComponent';
import EraseSizeComponent from './components/EraseSizeComponent';
import CanvasComponent from './components/CanvasComponent';
import LineSizeComponent from './components/LineSizeComponent';
import ToolSelectComponent from './components/ToolSelectComponent';
import UndoRedoComponent from './components/UndoRedoComponent';
import VoiceChatComponent from '../voice/components/VoiceChatComponent';

// interfaces
import { DrawData } from './interfaces/draw-interfaces';
import { Params, PeerConnectionContext } from './interfaces/index-interfaces';

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
} from '../functions/connect';

function Draw() {
  //@ Connection's States
  const rtcConfig = {
    iceServers: [
      {
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:global.stun.twilio.com:3478',
        ],
      },
    ],
  };
  const { roomKey } = useParams<Params>();
  const [
    peerConnectionContext,
    setPeerConnectionContext,
  ] = useState<PeerConnectionContext>({
    username: `user-${uuid()}`,
    roomId: roomKey,
    token: null,
    eventSource: null,
    peers: {},
    channels: {},
    is_new: true,
    is_host: false,
    hostId: null,
  });
  const [onPeerDataSignal, setOnPeerDataSignal] = useState<string>();
  const [actionHistorySignal, setActionHistorySignal] = useState<Event[]>([]);
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

  //@ Drawing's States
  const [activeTool, setActiveTool] = useState<string>('');
  const [canvas, setCanvas] = useState<any>(null);
  const [color, setColor] = useState('#000000');
  const [cursorWidth, setCursorWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(30);
  const [lineWidth, setLineWidth] = useState(5);
  const [isLiveClosed, setIsLiveClosed] = useState<boolean>(false);
  // const [pathsry, setPathsry] = useState<point[][]>([]);
  // const [points, setPoints] = useState<point[]>([]);

  //! 하나의 ctx를 사용, 전역으로 사용하기 위해 Context API 사용
  //! 레이어 마다 하나씩 가지고 있는 방법으로 바꿔야함

  // function drawPaths() {
  //   // delete everything
  //   ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  //   // draw all the paths in the paths array
  //   pathsry.forEach((path) => {
  //     ctx.beginPath();
  //     ctx.moveTo(path[0].x, path[0].y);
  //     for (let i = 1; i < path.length; i++) {
  //       ctx.lineTo(path[i].x, path[i].y);
  //     }
  //     ctx.stroke();
  //     ctx.closePath();
  //   });
  // }

  // function Undo() {
  //   // remove the last path from the paths array
  //   console.log('before drawpaths');
  //   console.log(pathsry);
  //   pathsry.splice(-1, 1);
  //   // draw all the paths in the paths array
  //   drawPaths();
  //   console.log('after drawpaths');
  //   console.log(pathsry);
  // }

  async function connectInit(): Promise<void> {
    // console.log('========= connect ==========');
    const token = await getToken(peerConnectionContext);
    const context = { ...peerConnectionContext };
    context.token = token;
    context.eventSource = new EventSource(
      `${process.env.REACT_APP_RTC_URL}/connect?token=${token}`,
    );

    context.eventSource.addEventListener(
      'add-peer',
      changeAddPeerSignal,
      false,
    );
    context.eventSource.addEventListener(
      'remove-peer',
      changeRemovePeerSignal,
      false,
    );
    context.eventSource.addEventListener(
      'session-description',
      changeSessionDescriptionSignal,
      false,
    );
    context.eventSource.addEventListener(
      'ice-candidate',
      changeIceCandidateSignal,
      false,
    );
    context.eventSource.addEventListener('connected', changeJoinRoomSignal);
    context.eventSource.addEventListener(
      'send-history-data',
      changeSendHistoryDataSignal,
      false,
    );
    context.eventSource.addEventListener(
      'set-host',
      changeSetHostSignal,
      false,
    );
    setPeerConnectionContext(context);
  }

  /*
   * ========================================================
   * ========================================================
   * ========================================================
   */

  function changeOnPeerDataSignal(_: string, data: string): void {
    // console.log('========= onPeerData ==========');
    setOnPeerDataSignal(data);
  }

  //! data:any 수정
  function changeAddPeerSignal(data: any): void {
    setAddPeerSignal(data.data);
  }

  //! data:any 수정
  function changeRemovePeerSignal(data: any): void {
    // console.log('========= removePeer ==========');
    setRemovePeerSignal(data.data);
  }

  //! data:any 수정
  function changeSessionDescriptionSignal(data: any): void {
    // console.log('========= sessionDescription ==========');
    setSessionDescriptionSignal(data.data);
  }

  //! data:any 수정
  function changeIceCandidateSignal(data: any): void {
    // console.log('========= iceCandidate ==========');
    setIceCandidateSignal(data.data);
  }

  //! data:any 수정
  function changeJoinRoomSignal(data: any): void {
    // console.log('========= join ==========');
    setJoinRoomSignal(data.timeStamp);
  }

  //! data:any 수정
  function changeSendHistoryDataSignal(data: any): void {
    // console.log('========== sendHistoryData 이벤트는 들어오냐? ==========');
    setSendHistoryDataSignal(data.timeStamp);
  }

  //! data:any 수정
  function changeSetHostSignal(data: any): void {
    // console.log('========== setHost ==========');
    setSetHostSignal(data.timeStamp);
  }

  /*
   * ========================================================
   * ========================================================
   * ========================================================
   */

  // //@ function: actionDrawHistory
  // useEffect(() => {
  //   if (!actionHistorySignal.length) return;
  //   console.log('actionHistorySignal 을 받았다!');
  //   // actionDrawHistory(actionHistorySignal, canvasCtxTable);
  // }, [actionHistorySignal]);

  //@ function: onPeerData
  useEffect(() => {
    if (canvas === null || onPeerDataSignal == '' || onPeerDataSignal == null)
      return;
    const message = JSON.parse(onPeerDataSignal);
    onPeerData(message, canvas, peerConnectionContext);
  }, [onPeerDataSignal]);

  //@ function: addPeer
  useEffect(() => {
    if (addPeerSignal === null) return;
    // console.log('========= addPeer ==========');

    const message = JSON.parse(addPeerSignal);
    if (peerConnectionContext.peers[message.peer.id]) return;
    addPeer(
      message,
      peerConnectionContext,
      rtcConfig,
      changeOnPeerDataSignal,
      setPeerConnectionContext,
    );
  }, [addPeerSignal]);

  //@ function: removePeer
  useEffect(() => {
    if (removePeerSignal === null) return;
    console.log('========= removePeer ==========');
    const message = JSON.parse(removePeerSignal);
    removePeer(message, peerConnectionContext, setPeerConnectionContext);
  }, [removePeerSignal]);

  //@ function: sessionDescription
  useEffect(() => {
    if (sessionDescriptionSignal === null) return;
    // console.log('========= sessionDescription ==========');

    const message = JSON.parse(sessionDescriptionSignal);
    if (peerConnectionContext.token === null || !message) return;
    sessionDescription(message, peerConnectionContext);
  }, [sessionDescriptionSignal]);

  //@ function: iceCandidate
  useEffect(() => {
    if (iceCandidateSignal === null) return;
    // console.log('========= iceCandidate ==========');
    const message = JSON.parse(iceCandidateSignal);
    iceCandidate(message, peerConnectionContext);
  }, [iceCandidateSignal]);

  //@ function: joinRoom
  useEffect(() => {
    if (joinRoomSignal === null) return;
    // console.log('========= join ==========');
    joinRoom(peerConnectionContext);
  }, [joinRoomSignal]);

  //@ function: sendHistoryData
  useEffect(() => {
    if (sendHistoryDataSignal === null) return;
    console.log('========= sendHistoryData ==========');
    if (!peerConnectionContext.is_host) {
      console.log('나는 호스트가 아니야');
      return;
    }
    // console.log(canvas.historyNextState);
    // console.log(canvas.historyRedo);
    // console.log(canvas.historyUndo);
    // console.log(JSON.stringify(canvas));
    sendHistoryData(canvas, peerConnectionContext);
  }, [sendHistoryDataSignal]);

  //@ function: setHost
  useEffect(() => {
    if (setHostSignal === null) return;
    console.log('========== setHost ==========');
    setHost(peerConnectionContext, setPeerConnectionContext);
  }, [setHostSignal]);

  //@ function: connectInit
  useEffect(() => {
    connectInit();
  }, []);

  // useEffect(() => {
  //   console.log(drawHistory);
  // }, [drawHistory]);

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
          <CursorToolComponent
            activeTool={activeTool}
            canvas={canvas}
            setActiveTool={setActiveTool}
            setCursorWidth={setCursorWidth}
          />
          <DeleteObjectComponent canvas={canvas} />
          <AddImageComponent canvas={canvas} />
          <div className='spacer'></div>

          <ToolSelectComponent
            activeTool={activeTool}
            canvas={canvas}
            color={color}
            eraserWidth={eraserWidth}
            lineWidth={lineWidth}
            setActiveTool={setActiveTool}
            setCanvas={setCanvas}
            setCursorWidth={setCursorWidth}
          />
          <UndoRedoComponent
            canvas={canvas}
            peerConnectionContext={peerConnectionContext}
          />
          {activeTool !== 'eraser' ? (
            <LineSizeComponent
              activeTool={activeTool}
              canvas={canvas}
              cursorWidth={cursorWidth}
              lineWidth={lineWidth}
              setCanvas={setCanvas}
              setCursorWidth={setCursorWidth}
              setLineWidth={setLineWidth}
            />
          ) : (
            <EraseSizeComponent
              activeTool={activeTool}
              canvas={canvas}
              cursorWidth={cursorWidth}
              eraserWidth={eraserWidth}
              setCanvas={setCanvas}
              setCursorWidth={setCursorWidth}
              setEraserWidth={setEraserWidth}
            />
          )}

          <div className='spacer'></div>
          <ColorPaletteComponent
            canvas={canvas}
            color={color}
            setCanvas={setCanvas}
            setColor={setColor}
          />
          <div className='spacer'></div>

          <CloseButtonComponent
            isHost={peerConnectionContext.is_host}
            setIsLiveClosed={setIsLiveClosed}
          />
          <div className='spacer'></div>
          <VoiceChatComponent></VoiceChatComponent>
        </div>
        <CanvasComponent
          activeTool={activeTool}
          canvas={canvas}
          drawHistory={drawHistory}
          peerConnectionContext={peerConnectionContext}
          setCanvas={setCanvas}
          setDrawHistory={setDrawHistory}
        />
      </div>
    </div>
  );
}

export default Draw;
