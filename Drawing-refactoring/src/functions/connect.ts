import axios from 'axios';
import { PeerConnectionContext } from '../draw/interfaces/index-interfaces';
import { broadcast, actionDrawHistory } from './draw';

export async function getToken(
  peerConnectionContext: PeerConnectionContext,
): Promise<string> {
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
    `${process.env.REACT_APP_RTC_URL}/access`,
    data,
    config,
  );
  return response.data.token;
}

//! data:any 수정
export async function relay(
  peerId: string,
  event: string,
  data: any,
  token: string,
): Promise<void> {
  // console.log('========= relay ==========');

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  };

  await axios.post(
    `${process.env.REACT_APP_RTC_URL}/relay/${peerId}/${event}`,
    data,
    config,
  );
}

async function createOffer(
  peerId: string,
  peer: RTCPeerConnection,
  token: string | null,
): Promise<void> {
  // console.log('========= createOffer ==========');
  if (!token) return;

  const offer = await peer.createOffer();
  await peer.setLocalDescription(offer);
  await relay(peerId, 'session-description', offer, token);
}

export function onPeerData(
  message: any,
  canvas: any,
  peerConnectionContext: any,
): void {
  switch (message.event) {
    case 'object:added':
      // console.log('object:added');
      // addObject(message, canvas);
      // setDrawHistory([...drawHistory, message]);
      break;

    case 'undo':
      // console.log('undo');
      // canvas.undo();
      break;

    case 'redo':
      // console.log('redo');
      // canvas.redo();
      break;

    case 'history':
    // console.log('history');
    // actionDrawHistory(message, canvas, peerConnectionContext);
  }
}

//! data:any 수정
function requireDrawHistory(peerConnectionContext: any): void {
  console.log('========== requireDrawHistory ==========');
  if (peerConnectionContext.hostId !== null) {
    relay(
      peerConnectionContext.hostId,
      'send-history-data',
      { data: null },
      peerConnectionContext.token,
    );
  }
}

export function addPeer(
  message: any,
  peerConnectionContext: any,
  rtcConfig: any,
  changeOnPeerDataSignal: any,
  setPeerConnectionContext: any,
): void {
  // deep copy 'peerConnectionContext' state
  const context = { ...peerConnectionContext };
  context.hostId = message.hostId;

  // setup peer connection
  const peer: RTCPeerConnection = new RTCPeerConnection(rtcConfig);
  context.peers[message.peer.id] = peer;

  // handle ice candidate
  peer.onicecandidate = function (event): void {
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

  // generate offer if required. on join, this peer will create an offer
  // to every other peer in the network
  if (message.offer) {
    // create the data channel, map peer updates
    const channel = peer.createDataChannel('updates');
    channel.onmessage = function (event): void {
      changeOnPeerDataSignal(message.peer.id, event.data);
    };
    context.channels[message.peer.id] = channel;
    createOffer(message.peer.id, peer, peerConnectionContext.token);
  } else {
    peer.ondatachannel = function (event): void {
      context.channels[message.peer.id] = event.channel;
      event.channel.onmessage = function (evt: MessageEvent): void {
        changeOnPeerDataSignal(message.peer.id, evt.data);
      };
    };
  }

  // set 'peerConnectionContext' state
  setPeerConnectionContext(context);
}

export function removePeer(
  message: any,
  peerConnectionContext: any,
  setPeerConnectionContext: any,
): void {
  // deep copy 'peerConnectionContext' state
  const context = { ...peerConnectionContext };

  if (context.peers[message.peer.id]) {
    context.peers[message.peer.id].close();
  }
  delete context.peers[message.peer.id];

  // set 'peerConnectionContext' state
  setPeerConnectionContext(context);
}

export async function sessionDescription(
  message: any,
  peerConnectionContext: any,
): Promise<void> {
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

export function iceCandidate(message: any, peerConnectionContext: any): void {
  const peer = peerConnectionContext.peers[message.peer.id];
  if (!peer) return;
  peer.addIceCandidate(new RTCIceCandidate(message.data));
  // console.log(peer.iceGatheringState);

  // if (!peerConnectionContext.is_host && peerConnectionContext.is_new) {
  //   requireDrawHistory(peerConnectionContext);
  // }
}

export async function joinRoom(peerConnectionContext: any): Promise<void> {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${peerConnectionContext.token}`,
    },
  };
  await axios.post(
    `${process.env.REACT_APP_RTC_URL}/${peerConnectionContext.roomId}/join`,
    null,
    config,
  );
}

export function sendHistoryData(canvas: any, peerConnectionContext: any): void {
  // console.log('========== sendHistoryData ==========');

  const message = {
    event: 'history',
    canvas: canvas,
    historyNextState: canvas.historyNextState,
    historyRedo: canvas.historyRedo,
    historyUndo: canvas.historyUndo,
  };
  broadcast(JSON.stringify(message), peerConnectionContext);
}

export function setHost(
  peerConnectionContext: any,
  setPeerConnectionContext: any,
): void {
  const context = { ...peerConnectionContext };
  context.is_host = true;
  context.is_new = false;
  setPeerConnectionContext(context);
}

export function closeLive(setIsLiveClosed: any): void {
  setIsLiveClosed(true);
}
