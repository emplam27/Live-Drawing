import React, { useState, useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
// import { CanvasCtxsProvider } from './DrawContext';
import { draw, drawRect } from '../../functions/draw';
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

  const { roomKey } = useParams<Params>();
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
  });

  function actionPeerData(msg: any) {
    console.log('========= actionPeerData ==========');
    forceUpdate();

    console.log(canvasCtxTable);
    if (activeLayer === null || activeLayer.canvasCtx === null) return;

    console.log(activeLayer.canvasCtx);
    console.log(msg);
    if (msg.event === 'draw') {
      draw(msg, activeLayer.canvasCtx);
    } else if (msg.event === 'drawRect') {
      drawRect(msg, false, activeLayer.canvasCtx);
    } else if (msg.event === 'clear') {
      // canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (msg.event === 'drawHistoryData') {
      // drawHistoryData(msg);
    }
  }

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
    console.log(activeLayer);
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
    console.log(activeLayer);
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
    console.log(activeLayer);
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
      iceCandidate,
      false,
    );
    tmpContext.eventSource.addEventListener('connected', () => join(token));
    setPeerConnectionContext(tmpContext);
  }

  //! data:any 수정
  function addPeer(data: any, token: string) {
    console.log('========= addPeer ==========');
    console.log(activeLayer);

    const message = JSON.parse(data.data);
    if (peerConnectionContext.peers[message.peer.id]) {
      return;
    }

    const updatePeerConnectionContext = { ...peerConnectionContext };

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
    console.log(activeLayer);

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
    console.log(activeLayer);

    const msg = JSON.parse(data);
    actionPeerData(msg);
  }

  //! data:any 수정
  function removePeer(data: any) {
    console.log('========= removePeer ==========');
    console.log(activeLayer);

    const message = JSON.parse(data.data);
    if (peerConnectionContext.peers[message.peer.id]) {
      peerConnectionContext.peers[message.peer.id].close();
    }
    delete peerConnectionContext.peers[message.peer.id];
  }

  //! data:any 수정
  async function sessionDescription(data: any, token: string) {
    console.log('========= sessionDescription ==========');
    console.log(activeLayer);

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
  function iceCandidate(data: any) {
    console.log('========= iceCandidate ==========');
    console.log(activeLayer);

    const message = JSON.parse(data.data);
    const peer = peerConnectionContext.peers[message.peer.id];
    peer.addIceCandidate(new RTCIceCandidate(message.data));
  }

  const forceUpdate = React.useReducer(() => ({}), {})[1] as () => void;

  useEffect(() => {
    console.log('========= useEffect :: activeLayer ==========');
    console.log(activeLayer);
    if (activeLayer !== null) {
      setActiveLayer(activeLayer);
    }
  }, [activeLayer]);

  useEffect(() => {
    console.log('========= useEffect :: canvasCtxTable ==========');
    console.log(canvasCtxTable);
  }, [canvasCtxTable]);

  useEffect(() => {
    connect();
  }, []);

  return (
    <div>
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
          setLayers={setLayers}
          setCanvas={setCanvas}
          setLayerCount={setLayerCount}
          setActiveLayer={setActiveLayer}
          setCanvasCtx={setCanvasCtx}
          setCanvasCtxTable={setCanvasCtxTable}
        />
        {/* </CanvasCtxsProvider> */}
      </div>
    </div>
  );
}

export default Draw;
