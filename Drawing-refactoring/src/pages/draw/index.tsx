import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// import { useActiveLayerState } from './DrawContext';
import { broadcast, draw, drawRect } from '../../functions/draw';
import { v4 as uuid } from 'uuid';

import './index.css';
// import styled from 'styled-components';

import LayerComponent from './components/LayerComponent';
import CursorComponent from './components/CursorComponent';
import EraseSizeComponent from './components/EraseSizeComponent';
import LineSizeComponent from './components/LineSizeComponent';
import ToolSelectComponent from './components/ToolSelectComponent';
import ColorPaletteComponent from './components/ColorPaletteComponent';
import axios from 'axios';

// import styled from 'styled-components';

interface Params {
  roomKey: string;
}

interface Layer {
  name: string;
  canvasId: string;
  buttonId: string;
  canvasCtx: CanvasRenderingContext2D | null;
}

interface PeerConnectionContext {
  username: string;
  roomId: string;
  token: string | null;
  eventSource: EventSource | null;
  peers: { [key: string]: RTCPeerConnection };
  channels: any;
  is_new: boolean;
  is_host: boolean;
  hostId: string | null;
}

interface CanvasCtxTable {
  [key: string]: CanvasRenderingContext2D;
}

// interface point {
//   x: number;
//   y: number;
// }

function Draw() {
  // setRoomKey(roomKey);

  const [lineWidth, setLineWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(5);
  const [cursorWidth, setCursorWidth] = useState(5);
  // const [pathsry, setPathsry] = useState<point[][]>([]);
  // const [points, setPoints] = useState<point[]>([]);

  const [color, setColor] = useState('#000000');
  const [activeTool, setActiveTool] = useState('pencil');
  const [layers, setLayers] = useState<Layer[]>([]);
  const [layerCount, setLayerCount] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState<Layer | null>(null);
  const [canvas, setCanvas] = useState<any>(null);
  const [canvasCtx, setCanvasCtx] = useState<CanvasRenderingContext2D | null>(
    null,
  );

  //! 하나의 ctx를 사용, 전역으로 사용하기 위해 Context API 사용
  //! 레이어 마다 하나씩 가지고 있는 방법으로 바꿔야함
  const [canvasCtxTable, setCanvasCtxTable] = useState<CanvasCtxTable>({});
  const [drawHistory, setDrawHistory] = useState([]);

  const [onPeerDataSignal, setOnPeerDataSignal] = useState<string>();
  const [addPeerSignal, setAddPeerSignal] = useState<string | null>(null);
  const [removePeerSignal, setRemovePeerSignal] = useState<string | null>(null);
  const [sessionDescriptionSignal, setSessionDescriptionSignal] = useState<
    string | null
  >(null);
  const [iceCandidateSignal, setIceCandidateSignal] = useState<string | null>(
    null,
  );
  const [joinSignal, setJoinSignal] = useState<string | null>(null);
  const [sendHistoryDataSignal, setSendHistoryDataSignal] = useState<
    string | null
  >(null);
  const [setHostSignal, setSetHostSignal] = useState<string | null>(null);

  /*
   * context API
   */
  // const activeLayer = useActiveLayerState();

  // const useForceUpdate: any = () => {
  //   const [count, setCount] = useState(0);
  //   const increment = () => setCount((prevCount) => prevCount + 1);
  //   console.log('33333333333 useForceUpdate 33333333333');
  //   console.log(activeLayer);
  //   return [increment, count];
  // };
  // const [forceUpdate] = useForceUpdate();

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

  // let activeLayerDummy: Layer | null = null;

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

  async function getToken() {
    console.log('========= getToken ==========');
    // console.log(activeLayer);
    console.log(peerConnectionContext.username);
    console.table(peerConnectionContext);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const data = {
      username: peerConnectionContext.username,
    };
    const response = await axios.post(
      'http://localhost:8080/access',
      data,
      config,
    );
    console.log(response.data.token);

    // return data.token;
    return response.data.token;
  }

  // function addRTCEvents(peerConnectionContext: any) {
  //   console.log('이벤트 리스너를 새로 달았습니다.');
  //   console.table(peerConnectionContext);

  //   const tmpAddPeer = function (data: any) {
  //     addPeer(data, peerConnectionContext);
  //   };
  //   const tmpRemovePeer = function (data: any) {
  //     removePeer(data);
  //   };
  //   const tmpSessionDescription = function (data: any) {
  //     sessionDescription(data, peerConnectionContext);
  //   };
  //   const tmpIceCandidate = function (data: any) {
  //     iceCandidate(data, peerConnectionContext);
  //   };
  //   const tmpJoin = function () {
  //     join(peerConnectionContext);
  //   };
  //   const tmpSendHistoryData = function () {
  //     sendHistoryData(peerConnectionContext);
  //   };
  //   const tmpSetHost = function () {
  //     setHost(peerConnectionContext);
  //   };

  //   //! removeEventListener
  //   peerConnectionContext.eventSource.removeEventListener(
  //     'add-peer',
  //     tmpAddPeer,
  //     false,
  //   );
  //   peerConnectionContext.eventSource.removeEventListener(
  //     'remove-peer',
  //     tmpRemovePeer,
  //     false,
  //   );
  //   peerConnectionContext.eventSource.removeEventListener(
  //     'session-description',
  //     tmpSessionDescription,
  //     false,
  //   );
  //   peerConnectionContext.eventSource.removeEventListener(
  //     'ice-candidate',
  //     tmpIceCandidate,
  //     false,
  //   );
  //   peerConnectionContext.eventSource.removeEventListener('connected', tmpJoin);
  //   peerConnectionContext.eventSource.removeEventListener(
  //     'send-history-data',
  //     tmpSendHistoryData,
  //     false,
  //   );
  //   peerConnectionContext.eventSource.removeEventListener(
  //     'youAreTheHost',
  //     tmpSetHost,
  //     false,
  //   );

  //   //! addEventListener
  //   peerConnectionContext.eventSource.addEventListener(
  //     'add-peer',
  //     tmpAddPeer,
  //     false,
  //   );
  //   peerConnectionContext.eventSource.addEventListener(
  //     'remove-peer',
  //     tmpRemovePeer,
  //     false,
  //   );
  //   peerConnectionContext.eventSource.addEventListener(
  //     'session-description',
  //     tmpSessionDescription,
  //     false,
  //   );
  //   peerConnectionContext.eventSource.addEventListener(
  //     'ice-candidate',
  //     tmpIceCandidate,
  //     false,
  //   );
  //   peerConnectionContext.eventSource.addEventListener('connected', tmpJoin);
  //   peerConnectionContext.eventSource.addEventListener(
  //     'send-history-data',
  //     tmpSendHistoryData,
  //     false,
  //   );
  //   peerConnectionContext.eventSource.addEventListener(
  //     'youAreTheHost',
  //     tmpSetHost,
  //     false,
  //   );
  //   console.table(peerConnectionContext);
  //   setPeerConnectionContext(peerConnectionContext);
  // }

  async function connect() {
    console.log('========= connect ==========');
    const token = await getToken();
    const tmpContext = { ...peerConnectionContext };
    tmpContext.token = token;
    tmpContext.eventSource = new EventSource(
      `http://localhost:8080/connect?token=${token}`,
    );

    tmpContext.eventSource.addEventListener('add-peer', addPeer, false);
    tmpContext.eventSource.addEventListener('remove-peer', removePeer, false);
    tmpContext.eventSource.addEventListener(
      'session-description',
      sessionDescription,
      false,
    );
    tmpContext.eventSource.addEventListener(
      'ice-candidate',
      iceCandidate,
      false,
    );
    tmpContext.eventSource.addEventListener('connected', join);
    tmpContext.eventSource.addEventListener(
      'send-history-data',
      sendHistoryData,
      false,
    );
    tmpContext.eventSource.addEventListener('youAreTheHost', setHost, false);
    console.table(tmpContext);
    setPeerConnectionContext(tmpContext);
    console.log(tmpContext);
    // addRTCEvents(tmpContext);
  }

  //! data:any 수정
  function addPeer(data: any) {
    setAddPeerSignal(data.data);
  }

  async function createOffer(
    peerId: string,
    peer: RTCPeerConnection,
    token: any,
  ) {
    console.log('========= createOffer ==========');

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    await relay(peerId, 'session-description', offer, token);
  }

  function relay(peerId: string, event: string, data: any, token: string) {
    console.log('========= relay ==========');
    console.log('peerId ::', peerId, 'event ::', event);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    axios.post(`http://localhost:8080/relay/${peerId}/${event}`, data, config);
  }

  function onPeerData(id: string, data: string) {
    // console.log('========= onPeerData ==========');
    // console.log(activeLayer);

    // const msg = JSON.parse(data);
    // actionPeerData(msg);
    setOnPeerDataSignal(data);
  }

  //! data:any 수정
  function removePeer(data: any) {
    console.log('========= removePeer ==========');
    setRemovePeerSignal(data.data);
    // const tmpPeerConnectionContext = { ...peerConnectionContext };
    // console.log(tmpPeerConnectionContext);

    // const message = JSON.parse(data.data);
    // if (tmpPeerConnectionContext.peers[message.peer.id]) {
    //   tmpPeerConnectionContext.peers[message.peer.id].close();
    // }
    // delete tmpPeerConnectionContext.peers[message.peer.id];

    // setPeerConnectionContext(tmpPeerConnectionContext);
  }

  //! data:any 수정
  async function sessionDescription(data: any) {
    setSessionDescriptionSignal(data.data);
    // console.log('========= sessionDescription ==========');
    // console.log(peerConnectionContext);

    // const message = JSON.parse(data.data);
    // const peer = peerConnectionContext.peers[message.peer.id];
    // const remoteDescription = new RTCSessionDescription(message.data);

    // await peer.setRemoteDescription(remoteDescription);
    // if (remoteDescription.type === 'offer') {
    //   const answer = await peer.createAnswer();
    //   await peer.setLocalDescription(answer);
    //   await relay(
    //     message.peer.id,
    //     'session-description',
    //     answer,
    //     peerConnectionContext.token,
    //   );
    // }
  }

  //! data:any 수정
  function iceCandidate(data: any) {
    setIceCandidateSignal(data.data);
    // console.log('========= iceCandidate ==========');
    // console.log(peerConnectionContext);

    // const message = JSON.parse(data.data);
    // const peer = peerConnectionContext.peers[message.peer.id];
    // peer.addIceCandidate(new RTCIceCandidate(message.data));
    // console.log(
    //   'peerConnectionContext.is_host ::',
    //   peerConnectionContext.is_host,
    // );
    // console.log(
    //   'peerConnectionContext.is_new ::',
    //   peerConnectionContext.is_new,
    // );
    // if (!peerConnectionContext.is_host && peerConnectionContext.is_new) {
    //   requireDrawHistory(peerConnectionContext);
    // }
  }

  async function join(data: any) {
    setJoinSignal('asdf');
    // console.log('========= join ==========');
    // // console.log(activeLayer);
    // // console.log(peerConnectionContext);
    // // console.log(token);
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: `Bearer ${peerConnectionContext.token}`,
    //   },
    // };
    // await axios.post(
    //   `http://localhost:8080/${peerConnectionContext.roomId}/join`,
    //   null,
    //   config,
    // );
  }

  function sendHistoryData(data: any) {
    setSendHistoryDataSignal('asdf');
    // console.log('========== load.js :: sendHistoryData ==========');
    // console.log(peerConnectionContext);
    // if (!peerConnectionContext.is_host) {
    //   return;
    // }

    // const historyData = {
    //   event: 'drawHistoryData',
    //   drawHistory: drawHistory,
    // };
    // console.log(historyData);
    // broadcast(JSON.stringify(historyData), peerConnectionContext);
  }

  function setHost(data: any) {
    setSetHostSignal('asdf');
  }

  function requireDrawHistory(peerConnectionContext: any) {
    console.log('========== load.js :: requireDrawHistory ==========');
    console.log('peerConnectionContext', peerConnectionContext);
    console.log('hostId', peerConnectionContext.hostId);
    if (peerConnectionContext.hostId !== null) {
      relay(
        peerConnectionContext.hostId,
        'send-history-data',
        { data: null },
        peerConnectionContext.token,
      );
    }
  }

  function actionDrawHistory(data: any, canvasCtx: any) {
    console.log(data);
    if (peerConnectionContext.is_new) {
      data.drawHistory.forEach((elem: any) => {
        //! 이벤트 종류 추가해야 함
        draw(elem, canvasCtx);
      });

      peerConnectionContext.is_new = false;
    }
  }

  //! addPeer
  useEffect(() => {
    if (addPeerSignal === null) return;
    console.log('========= addPeer ==========');
    console.table(peerConnectionContext);

    const message = JSON.parse(addPeerSignal);
    if (peerConnectionContext.peers[message.peer.id]) {
      return;
    }

    console.log('호스트가 아닌데?');
    console.log(message.hostId);

    const updatePeerConnectionContext = { ...peerConnectionContext };
    updatePeerConnectionContext.hostId = message.hostId;

    // setup peer connection
    const peer: RTCPeerConnection = new RTCPeerConnection(rtcConfig);
    updatePeerConnectionContext.peers[message.peer.id] = peer;

    // handle ice candidate
    peer.onicecandidate = function (event) {
      if (peerConnectionContext.token === null) return;
      if (event.candidate) {
        relay(
          message.peer.id,
          'ice-candidate',
          event.candidate,
          peerConnectionContext.token,
        );
      }
    };

    // console.log(updatePeerConnectionContext);

    // generate offer if required (on join, this peer will create an offer
    // to every other peer in the network, thus forming a mesh)
    if (message.offer) {
      // create the data channel, map peer updates
      const channel = peer.createDataChannel('updates');
      channel.onmessage = function (event) {
        onPeerData(message.peer.id, event.data);
      };
      updatePeerConnectionContext.channels[message.peer.id] = channel;
      createOffer(message.peer.id, peer, peerConnectionContext.token);
    } else {
      peer.ondatachannel = function (event) {
        updatePeerConnectionContext.channels[message.peer.id] = event.channel;
        event.channel.onmessage = function (evt: MessageEvent) {
          onPeerData(message.peer.id, evt.data);
        };
      };
    }
    setPeerConnectionContext(updatePeerConnectionContext);
  }, [addPeerSignal]);

  //! removePeer
  useEffect(() => {
    if (removePeerSignal === null) return;
    console.log('========= removePeer ==========');

    const tmpPeerConnectionContext = { ...peerConnectionContext };
    console.log(tmpPeerConnectionContext);

    const message = JSON.parse(removePeerSignal);
    if (tmpPeerConnectionContext.peers[message.peer.id]) {
      tmpPeerConnectionContext.peers[message.peer.id].close();
    }
    delete tmpPeerConnectionContext.peers[message.peer.id];

    setPeerConnectionContext(tmpPeerConnectionContext);
  }, [removePeerSignal]);

  //! sessionDescription
  useEffect(() => {
    if (sessionDescriptionSignal === null) return;
    console.log('========= sessionDescription ==========');
    console.log(peerConnectionContext);

    const message = JSON.parse(sessionDescriptionSignal);

    async function relaySessionDescription(message: any) {
      const peer = peerConnectionContext.peers[message?.peer.id];
      const remoteDescription = new RTCSessionDescription(message.data);

      if (peerConnectionContext.token === null) return;
      await peer.setRemoteDescription(remoteDescription);
      if (remoteDescription.type === 'offer') {
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        await relay(
          message.peer.id,
          'session-description',
          answer,
          peerConnectionContext.token,
        );
      }
    }

    relaySessionDescription(message);
    // await peer.setRemoteDescription(remoteDescription);
    // if (remoteDescription.type === 'offer') {
    //   const answer = await peer.createAnswer();
    //   await peer.setLocalDescription(answer);
    //   await relay(
    //     message.peer.id,
    //     'session-description',
    //     answer,
    //     peerConnectionContext.token,
    //   );
    // }
  }, [sessionDescriptionSignal]);

  //! iceCandidate
  useEffect(() => {
    if (iceCandidateSignal === null) return;
    console.log('========= iceCandidate ==========');
    console.log('========= iceCandidate ==========');
    console.log('========= iceCandidate ==========');
    console.log('========= iceCandidate ==========');
    console.log('========= iceCandidate ==========');
    console.log('========= iceCandidate ==========');
    console.log('========= iceCandidate ==========');
    console.log('========= iceCandidate ==========');
    console.log(peerConnectionContext);

    const message = JSON.parse(iceCandidateSignal);
    console.log(message);
    const peer = peerConnectionContext.peers[message.peer.id];
    if (!peer) return;
    peer.addIceCandidate(new RTCIceCandidate(message.data));
    console.log(
      'peerConnectionContext.is_host ::',
      peerConnectionContext.is_host,
    );
    console.log(
      'peerConnectionContext.is_new ::',
      peerConnectionContext.is_new,
    );
    if (!peerConnectionContext.is_host && peerConnectionContext.is_new) {
      requireDrawHistory(peerConnectionContext);
    }
  }, [iceCandidateSignal]);

  //! join
  useEffect(() => {
    if (joinSignal === null) return;

    console.log('========= join ==========');
    // console.log(activeLayer);
    // console.log(peerConnectionContext);
    // console.log(token);

    async function joinRequest() {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${peerConnectionContext.token}`,
        },
      };
      await axios.post(
        `http://localhost:8080/${peerConnectionContext.roomId}/join`,
        null,
        config,
      );
    }
    joinRequest();
  }, [joinSignal]);

  //! sendHistoryData
  useEffect(() => {
    if (sendHistoryDataSignal === null) return;

    console.log('========== load.js :: sendHistoryData ==========');
    console.log(drawHistory);

    if (!peerConnectionContext.is_host) {
      return;
    }

    const historyData = {
      event: 'drawHistoryData',
      drawHistory: drawHistory,
    };
    console.log(historyData);
    broadcast(JSON.stringify(historyData), peerConnectionContext);
  }, [sendHistoryDataSignal]);

  //! setHost
  useEffect(() => {
    if (setHostSignal === null) return;

    console.log('========== load.js :: setHost ==========');
    console.log('========== load.js :: setHost ==========');
    console.log('========== load.js :: setHost ==========');
    console.log('========== load.js :: setHost ==========');
    console.log('========== load.js :: setHost ==========');
    console.log('========== load.js :: setHost ==========');
    console.log('========== load.js :: setHost ==========');
    console.log('========== load.js :: setHost ==========');
    console.log('========== load.js :: setHost ==========');
    console.log(peerConnectionContext);
    const tmpPeerConnectionContext = { ...peerConnectionContext };
    tmpPeerConnectionContext.is_host = true;
    tmpPeerConnectionContext.is_new = false;
    setPeerConnectionContext(tmpPeerConnectionContext);
  }, [setHostSignal]);

  // useEffect(() => {
  //   if (activeLayer === null || peerConnectionContext.token === null) return;
  //   console.log('!!!!!!!!!!!!!!!! activeLayer가 바뀌었다 !!!!!!!!!!!!!!!!!');
  //   console.table(peerConnectionContext);
  //   // addRTCEvents(peerConnectionContext);
  // }, [activeLayer]);

  // useEffect(() => {
  //   if (peerConnectionContext.is_host === false) return;
  //   console.log('!!!!!!!!!!!!!!!! is_host가 바뀌었다 !!!!!!!!!!!!!!!!!');
  //   console.table(peerConnectionContext);
  //   // addRTCEvents(peerConnectionContext);
  // }, [peerConnectionContext.is_host]);

  // useEffect(() => {
  //   if (peerConnectionContext.is_new || peerConnectionContext.is_host) return;
  //   console.log('!!!!!!!!!!!!!!!! is_new가 바뀌었다 !!!!!!!!!!!!!!!!!');
  //   console.table(peerConnectionContext);
  //   // addRTCEvents(peerConnectionContext);
  // }, [peerConnectionContext.is_new]);

  // useEffect(() => {
  //   if (peerConnectionContext.hostId === null) return;
  //   console.log('!!!!!!!!!!!!!!!! hostId가 바뀌었다 !!!!!!!!!!!!!!!!!');
  //   console.table(peerConnectionContext);
  //   // addRTCEvents(peerConnectionContext);
  // }, [peerConnectionContext.hostId]);

  useEffect(() => {
    console.log('peerConnectionContext가 바뀌었습니다!!!!!!!!!!!!!!!');
    console.table(peerConnectionContext);
  }, [peerConnectionContext]);

  //!
  useEffect(() => {
    if (
      activeLayer === null ||
      activeLayer.canvasCtx === null ||
      onPeerDataSignal == '' ||
      onPeerDataSignal == null
    )
      return;
    const tempMsg = JSON.parse(onPeerDataSignal);
    // console.log('-----------------', activeLayer.canvasCtx);
    // console.log(tempMsg);
    if (tempMsg.event === 'draw') {
      draw(tempMsg, activeLayer.canvasCtx);
    } else if (tempMsg.event === 'drawRect') {
      drawRect(tempMsg, false, activeLayer.canvasCtx);
    } else if (tempMsg.event === 'clear') {
      // canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (tempMsg.event === 'drawHistoryData') {
      actionDrawHistory(tempMsg, activeLayer.canvasCtx);
    }
  }, [onPeerDataSignal]);

  useEffect(() => {
    console.log('connect() 실행!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('connect() 실행!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('connect() 실행!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.log('connect() 실행!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    connect();
  }, []);

  return (
    <div className='drawComponent'>
      <p>Draw component</p>
      <CursorComponent cursorWidth={cursorWidth} />
      <div className='flush vstack'>
        <div className='menubar hstack'>
          <ToolSelectComponent
            lineWidth={lineWidth}
            eraserWidth={eraserWidth}
            setCursorWidth={setCursorWidth}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
          />
          <LineSizeComponent
            lineWidth={lineWidth}
            cursorWidth={cursorWidth}
            setLineWidth={setLineWidth}
            setCursorWidth={setCursorWidth}
          />
          <EraseSizeComponent
            eraserWidth={eraserWidth}
            cursorWidth={cursorWidth}
            setEraserWidth={setEraserWidth}
            setCursorWidth={setCursorWidth}
          />
          <div className='spacer'></div>
          <ColorPaletteComponent color={color} setColor={setColor} />
          <div className='spacer'></div>
        </div>
        {/* <CanvasCtxsProvider> */}
        <LayerComponent
          activeTool={activeTool}
          color={color}
          lineWidth={lineWidth}
          eraserWidth={eraserWidth}
          layers={layers}
          canvas={canvas}
          layerCount={layerCount}
          activeLayer={activeLayer}
          canvasCtx={canvasCtx}
          canvasCtxTable={canvasCtxTable}
          peerConnectionContext={peerConnectionContext}
          drawHistory={drawHistory}
          setLayers={setLayers}
          setCanvas={setCanvas}
          setLayerCount={setLayerCount}
          setActiveLayer={setActiveLayer}
          setCanvasCtx={setCanvasCtx}
          setCanvasCtxTable={setCanvasCtxTable}
          // updateActiveLayer={updateActiveLayer}
          setDrawHistory={setDrawHistory}
        />
        {/* </CanvasCtxsProvider> */}
      </div>
    </div>
  );
}

export default Draw;
