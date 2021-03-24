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
  const [newMsg, setNewMsg] = useState<string>();
  const [drawHistory, setDrawHistory] = useState([]);

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

  useEffect(() => {
    if (
      activeLayer === null ||
      activeLayer.canvasCtx === null ||
      newMsg == '' ||
      newMsg == null
    )
      return;
    const tempMsg = JSON.parse(newMsg);
    // console.log('-----------------', activeLayer.canvasCtx);
    console.log(tempMsg);
    if (tempMsg.event === 'draw') {
      draw(tempMsg, activeLayer.canvasCtx);
    } else if (tempMsg.event === 'drawRect') {
      drawRect(tempMsg, false, activeLayer.canvasCtx);
    } else if (tempMsg.event === 'clear') {
      // canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (tempMsg.event === 'drawHistoryData') {
      actionDrawHistory(tempMsg, activeLayer.canvasCtx);
    }
  }, [newMsg]);

  function actionDrawHistory(data: any, canvasCtx: any) {
    if (peerConnectionContext.is_new) {
      data.history.forEach((elem: any) => {
        //! 이벤트 종류 추가해야 함
        draw(elem, canvasCtx);
      });

      peerConnectionContext.is_new = false;
    }
  }

  // function actionPeerData(msg: any) {
  //   console.log('========= actionPeerData ==========');
  //   forceUpdate();
  //   // const activeLayerDummy = useActiveLayerState();

  //   // console.log(activeLayerDummy);
  //   console.log(activeLayer);
  //   console.log(peerConnectionContext);
  //   console.log(eraserWidth);
  //   console.log(cursorWidth);
  //   console.log(color);
  //   console.log(activeTool);
  //   console.log(layers);
  //   console.log(layerCount);
  //   console.log(canvas);
  //   console.log(canvasCtx);
  //   if (activeLayer === null || activeLayer.canvasCtx === null) return;

  //   console.log(activeLayer.canvasCtx);
  //   console.log(msg);
  //   if (msg.event === 'draw') {
  //     draw(msg, activeLayer.canvasCtx);
  //   } else if (msg.event === 'drawRect') {
  //     drawRect(msg, false, activeLayer.canvasCtx);
  //   } else if (msg.event === 'clear') {
  //     // canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
  //   } else if (msg.event === 'drawHistoryData') {
  //     // drawHistoryData(msg);
  //   }
  // }

  // async function updateActiveLayer(tmp: Layer) {
  //   console.log('***************** updateActiveLayer ***********');
  //   console.log(tmp);
  //   activeLayerDummy = tmp;
  //   setActiveLayer(tmp);
  // }

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
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const data = {
      username: peerConnectionContext.username,
    };
    const response = await axios.post(
      'http://localhost:8081/access',
      data,
      config,
    );
    // console.log(response.data.token);

    // return data.token;
    return response.data.token;
  }

  async function join(token: string) {
    console.log('========= join ==========');
    // console.log(activeLayer);
    // console.log(peerConnectionContext);
    // console.log(token);
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    await axios.post(
      `http://localhost:8081/${peerConnectionContext.roomId}/join`,
      null,
      config,
    );
  }

  async function connect() {
    console.log('========= connect ==========');
    // console.log(activeLayer);
    const token = await getToken();
    const tmpContext = { ...peerConnectionContext };
    tmpContext.token = token;

    tmpContext.eventSource = new EventSource(
      `http://localhost:8081/connect?token=${token}`,
    );
    tmpContext.eventSource.addEventListener(
      'add-peer',
      (data) => addPeer(data, token),
      false,
    );
    tmpContext.eventSource.addEventListener('remove-peer', removePeer, false);
    tmpContext.eventSource.addEventListener(
      'session-description',
      (data) => sessionDescription(data, token),
      false,
    );
    tmpContext.eventSource.addEventListener(
      'ice-candidate',
      (data) => iceCandidate(data, token),
      false,
    );
    tmpContext.eventSource.addEventListener('connected', () => join(token));
    tmpContext.eventSource.addEventListener(
      'send-history-data',
      () => sendHistoryData(token),
      false,
    );
    tmpContext.eventSource.addEventListener('youAreTheHost', setHost, false);
    setPeerConnectionContext(tmpContext);
  }

  //! data:any 수정
  function addPeer(data: any, token: string) {
    console.log('========= addPeer ==========');
    // console.log(activeLayer);

    const message = JSON.parse(data.data);
    if (peerConnectionContext.peers[message.peer.id]) {
      return;
    }

    const updatePeerConnectionContext = { ...peerConnectionContext };
    updatePeerConnectionContext.hostId = message.hostId;

    // setup peer connection
    const peer: RTCPeerConnection = new RTCPeerConnection(rtcConfig);
    updatePeerConnectionContext.peers[message.peer.id] = peer;

    // handle ice candidate
    peer.onicecandidate = function (event) {
      if (event.candidate) {
        relay(message.peer.id, 'ice-candidate', event.candidate, token);
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
      createOffer(message.peer.id, peer, token);
    } else {
      peer.ondatachannel = function (event) {
        updatePeerConnectionContext.channels[message.peer.id] = event.channel;
        event.channel.onmessage = function (evt: MessageEvent) {
          onPeerData(message.peer.id, evt.data);
        };
      };
    }
    setPeerConnectionContext(updatePeerConnectionContext);
  }

  async function createOffer(
    peerId: string,
    peer: RTCPeerConnection,
    token: string,
  ) {
    console.log('========= createOffer ==========');
    // console.log(activeLayer);

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    await relay(peerId, 'session-description', offer, token);
  }

  function relay(peerId: string, event: string, data: any, token: string) {
    // console.log('========= relay ==========');
    // console.log(peerConnectionContext.peers);
    // console.log('peerId ::', peerId);
    // console.log('event ::', event);
    // console.log('peerConnectionContext.token ::', token);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    axios.post(`http://localhost:8081/relay/${peerId}/${event}`, data, config);
  }

  function onPeerData(id: string, data: string) {
    console.log('========= onPeerData ==========');
    // console.log(activeLayer);

    // const msg = JSON.parse(data);
    // actionPeerData(msg);
    setNewMsg(data);
  }

  //! data:any 수정
  function removePeer(data: any) {
    console.log('========= removePeer ==========');

    const tmpPeerConnectionContext = { ...peerConnectionContext };
    console.log(tmpPeerConnectionContext);

    const message = JSON.parse(data.data);
    if (tmpPeerConnectionContext.peers[message.peer.id]) {
      tmpPeerConnectionContext.peers[message.peer.id].close();
    }
    delete tmpPeerConnectionContext.peers[message.peer.id];

    setPeerConnectionContext(tmpPeerConnectionContext);
  }

  //! data:any 수정
  async function sessionDescription(data: any, token: string) {
    console.log('========= sessionDescription ==========');
    console.log(peerConnectionContext);

    const message = JSON.parse(data.data);
    const peer = peerConnectionContext.peers[message.peer.id];
    const remoteDescription = new RTCSessionDescription(message.data);

    await peer.setRemoteDescription(remoteDescription);
    if (remoteDescription.type === 'offer') {
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      await relay(message.peer.id, 'session-description', answer, token);
    }
  }

  //! data:any 수정
  function iceCandidate(data: any, token: string) {
    console.log('========= iceCandidate ==========');
    console.log(peerConnectionContext);

    const message = JSON.parse(data.data);
    const peer = peerConnectionContext.peers[message.peer.id];
    peer.addIceCandidate(new RTCIceCandidate(message.data));
    if (!peerConnectionContext.is_host && peerConnectionContext.is_new) {
      requireDrawHistory(token);
    }
  }

  function sendHistoryData(data: any) {
    console.log('========== load.js :: sendHistoryData ==========');
    console.log(peerConnectionContext);
    if (!peerConnectionContext.is_host) {
      return;
    }

    const historyData = {
      event: 'drawHistoryData',
      drawHistory: drawHistory,
    };
    console.log(historyData);
    broadcast(JSON.stringify(historyData), peerConnectionContext);
  }

  function requireDrawHistory(token: string) {
    console.log('========== load.js :: requireDrawHistory ==========');
    console.log('peerConnectionContext', peerConnectionContext);
    console.log('hostId', peerConnectionContext.hostId);
    if (peerConnectionContext.hostId !== null) {
      relay(
        peerConnectionContext.hostId,
        'send-history-data',
        { data: null },
        token,
      );
    }
  }

  function setHost() {
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
  }

  // const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void;

  // useEffect(() => {
  //   console.log('========= useEffect :: activeLayer ==========');
  //   console.log(activeLayer);
  //   forceUpdate();
  // }, [activeLayer]);

  // useEffect(() => {
  //   console.log('========= useEffect :: canvasCtxTable ==========');
  //   console.log(canvasCtxTable);
  // }, [canvasCtxTable]);

  useEffect(() => {
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
