import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AddImageComponent from './components/AddImageComponent';
import ColorPaletteComponent from './components/ColorPaletteComponent';
import CursorComponent from './components/CursorComponent';
import DeleteObjectComponent from './components/DeleteObjectComponent';
import EraseSizeComponent from './components/EraseSizeComponent';
import LayerComponent from './components/LayerComponent';
import LineSizeComponent from './components/LineSizeComponent';
import ToolSelectComponent from './components/ToolSelectComponent';
import UndoRedoComponent from './components/UndoRedoComponent';
import axios from 'axios';
import {
  broadcast,
  draw,
  drawRect,
  actionDrawHistory,
} from '../../functions/draw';
import {
  Params,
  Layer,
  PeerConnectionContext,
  CanvasCtxTable,
} from './interfaces/index-interfaces';
import { DrawData } from './interfaces/draw-interfaces';
import { v4 as uuid } from 'uuid';
import './index.css';

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
  const [readyToDrawHistorySignal, setReadyToDrawHistorySignal] = useState<
    number | null
  >(null);
  const [addPeerSignal, setAddPeerSignal] = useState<string | null>(null);
  const [removePeerSignal, setRemovePeerSignal] = useState<string | null>(null);
  const [sessionDescriptionSignal, setSessionDescriptionSignal] = useState<
    string | null
  >(null);
  const [iceCandidateSignal, setIceCandidateSignal] = useState<string | null>(
    null,
  );
  const [joinSignal, setJoinSignal] = useState<number | null>(null);
  const [sendHistoryDataSignal, setSendHistoryDataSignal] = useState<
    number | null
  >(null);
  const [setHostSignal, setSetHostSignal] = useState<number | null>(null);

  //@ Drawing's States
  const [activeTool, setActiveTool] = useState<string>('');
  const [canvas, setCanvas] = useState<any>(null);
  const [color, setColor] = useState('#000000');
  const [cursorWidth, setCursorWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(5);
  const [lineWidth, setLineWidth] = useState(5);
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

  async function getToken(): Promise<string> {
    // console.log('========= getToken ==========');
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
    return response.data.token;
  }

  async function connect() {
    // console.log('========= connect ==========');
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
    setPeerConnectionContext(tmpContext);
  }

  async function createOffer(
    peerId: string,
    peer: RTCPeerConnection,
    token: any,
  ) {
    // console.log('========= createOffer ==========');

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    await relay(peerId, 'session-description', offer, token);
  }

  async function relay(
    peerId: string,
    event: string,
    data: any,
    token: string,
  ) {
    // console.log('========= relay ==========');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };

    await axios.post(
      `http://localhost:8080/relay/${peerId}/${event}`,
      data,
      config,
    );
  }

  function requireDrawHistory(peerConnectionContext: any) {
    // console.log('========== requireDrawHistory ==========');
    if (peerConnectionContext.hostId !== null) {
      relay(
        peerConnectionContext.hostId,
        'send-history-data',
        { data: null },
        peerConnectionContext.token,
      );
    }
  }

  function onPeerData(_: string, data: string) {
    // console.log('========= onPeerData ==========');
    setOnPeerDataSignal(data);
  }

  //! data:any 수정
  function addPeer(data: any) {
    setAddPeerSignal(data.data);
  }

  function removePeer(data: any) {
    // console.log('========= removePeer ==========');
    setRemovePeerSignal(data.data);
  }

  function sessionDescription(data: any) {
    // console.log('========= sessionDescription ==========');
    setSessionDescriptionSignal(data.data);
  }

  function iceCandidate(data: any) {
    // console.log('========= iceCandidate ==========');
    setIceCandidateSignal(data.data);
  }

  function join(data: any) {
    // console.log('========= join ==========');
    setJoinSignal(data.timeStamp);
  }

  function sendHistoryData(data: any) {
    // console.log('========== sendHistoryData 이벤트는 들어오냐? ==========');
    setSendHistoryDataSignal(data.timeStamp);
  }

  function setHost(data: any) {
    // console.log('========== setHost ==========');
    setSetHostSignal(data.timeStamp);
  }

  //@ function: onPeerData
  useEffect(() => {
    if (canvas === null || onPeerDataSignal == '' || onPeerDataSignal == null) {
      return;
    }

    const message = JSON.parse(onPeerDataSignal);
    if (message.event === 'draw') {
      // TODO: 들어온 이벤트에 맞는 캔버스에 그려야함
      draw(message, canvas);
      setDrawHistory([...drawHistory, message]);
    } else if (message.event === 'drawRect') {
      drawRect(message, false, canvas);
    } else if (message.event === 'clear') {
      // canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    } else if (
      message.event === 'drawHistoryData' &&
      peerConnectionContext.is_new
    ) {
      // // TODO: 레이어 생성
      // const newLayers: Layer[] = message.layers.map((layer: any) => {
      //   return {
      //     name: layer.name,
      //     canvasId: layer.canvasId,
      //     buttonId: layer.buttonId,
      //     canvasCtx: null,
      //   };
      // });
      // // TODO: 레이어 생성 완료되면 context data 변경
      // setDrawHistory([...drawHistory, ...message.drawHistory]);
      // const tmpPeerConnectionContext = { ...peerConnectionContext };
      // tmpPeerConnectionContext.is_new = false;
      // setPeerConnectionContext(tmpPeerConnectionContext);
      // // TODO: 레이어 생성 되면 useEffect 실행해서 지금까지 데이터 적기
      // setActionHistorySignal(message.drawHistory);
    }
  }, [onPeerDataSignal]);

  //@ function: actionDrawHistory
  useEffect(() => {
    if (!actionHistorySignal.length) return;
    console.log('actionHistorySignal 을 받았다!');
    // actionDrawHistory(actionHistorySignal, canvasCtxTable);
  }, [actionHistorySignal]);

  //@ function: addPeer
  useEffect(() => {
    if (addPeerSignal === null) return;
    // console.log('========= addPeer ==========');

    const message = JSON.parse(addPeerSignal);
    if (peerConnectionContext.peers[message.peer.id]) return;

    // Deep Copy 'peerConnectionContext' state
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

    // Set 'peerConnectionContext' state
    setPeerConnectionContext(updatePeerConnectionContext);
  }, [addPeerSignal]);

  //@ function: removePeer
  useEffect(() => {
    if (removePeerSignal === null) return;
    console.log('========= removePeer ==========');

    // Deep Copy 'peerConnectionContext' state
    const tmpPeerConnectionContext = { ...peerConnectionContext };

    const message = JSON.parse(removePeerSignal);
    if (tmpPeerConnectionContext.peers[message.peer.id]) {
      tmpPeerConnectionContext.peers[message.peer.id].close();
    }
    delete tmpPeerConnectionContext.peers[message.peer.id];

    // Set 'peerConnectionContext' state
    setPeerConnectionContext(tmpPeerConnectionContext);
  }, [removePeerSignal]);

  //@ function: sessionDescription
  useEffect(() => {
    if (sessionDescriptionSignal === null) return;
    // console.log('========= sessionDescription ==========');

    const message = JSON.parse(sessionDescriptionSignal);

    async function relaySessionDescription(message: any) {
      if (peerConnectionContext.token === null || !message) return;

      const peer = peerConnectionContext.peers[message.peer.id];
      const remoteDescription = new RTCSessionDescription(message.data);
      if (!peer || !remoteDescription) return;

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
  }, [sessionDescriptionSignal]);

  //@ function: iceCandidate
  useEffect(() => {
    if (iceCandidateSignal === null) return;
    // console.log('========= iceCandidate ==========');

    const message = JSON.parse(iceCandidateSignal);
    const peer = peerConnectionContext.peers[message.peer.id];
    if (!peer) return;
    peer.addIceCandidate(new RTCIceCandidate(message.data));
    if (!peerConnectionContext.is_host && peerConnectionContext.is_new) {
      requireDrawHistory(peerConnectionContext);
    }
  }, [iceCandidateSignal]);

  //@ function: join
  useEffect(() => {
    if (joinSignal === null) return;
    // console.log('========= join ==========');

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

  //@ function: sendHistoryData
  useEffect(() => {
    // if (sendHistoryDataSignal === null || !peerConnectionContext.is_host)
    //   return;
    // // console.log('========== sendHistoryData ==========');
    // const layerHistory = layers.map((layer) => {
    //   return {
    //     name: layer.name,
    //     canvasId: layer.canvasId,
    //     buttonId: layer.buttonId,
    //   };
    // });
    // const historyData = {
    //   event: 'drawHistoryData',
    //   layers: layerHistory,
    //   drawHistory: drawHistory,
    // };
    // broadcast(JSON.stringify(historyData), peerConnectionContext);
  }, [sendHistoryDataSignal]);

  //@ function: setHost
  useEffect(() => {
    if (setHostSignal === null) return;
    console.log('========== setHost ==========');

    const tmpPeerConnectionContext = { ...peerConnectionContext };
    tmpPeerConnectionContext.is_host = true;
    tmpPeerConnectionContext.is_new = false;
    setPeerConnectionContext(tmpPeerConnectionContext);
  }, [setHostSignal]);

  useEffect(() => {
    connect();
  }, []);

  // useEffect(() => {
  //   console.log(drawHistory);
  // }, [drawHistory]);

  return (
    <div className='drawComponent'>
      <CursorComponent cursorWidth={cursorWidth} />
      <div className='flush vstack'>
        <div className='menubar hstack'>
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
          <UndoRedoComponent canvas={canvas} />
          <DeleteObjectComponent canvas={canvas} />
          <div className='spacer'></div>
          <LineSizeComponent
            activeTool={activeTool}
            canvas={canvas}
            cursorWidth={cursorWidth}
            lineWidth={lineWidth}
            setCanvas={setCanvas}
            setCursorWidth={setCursorWidth}
            setLineWidth={setLineWidth}
          />
          <EraseSizeComponent
            activeTool={activeTool}
            canvas={canvas}
            cursorWidth={cursorWidth}
            eraserWidth={eraserWidth}
            setCanvas={setCanvas}
            setCursorWidth={setCursorWidth}
            setEraserWidth={setEraserWidth}
          />
          <div className='spacer'></div>
          <ColorPaletteComponent
            canvas={canvas}
            color={color}
            setCanvas={setCanvas}
            setColor={setColor}
          />
          <div className='spacer'></div>
          <AddImageComponent canvas={canvas} />
        </div>
        <LayerComponent
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
