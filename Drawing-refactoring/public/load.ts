import React from 'react';
// import { actionPeerData } from '../functions/draw';

function load() {}

// interface PeerConnectionContext {
//   username: string;
//   roomId: string;
//   token: string | null;
//   eventSource: EventSource | null;
//   peers: { [key: string]: RTCPeerConnection };
//   channels: any;
// }

// const peerConnectionContext: PeerConnectionContext = {
//   username: 'user' + `${Math.random() * 100000}`,
//   roomId: '',
//   token: null,
//   eventSource: null,
//   peers: {},
//   channels: {},
// };

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

// export function setRoomKey(roomKey: string) {
//   peerConnectionContext.roomId = roomKey;
// }

// async function getToken() {
//   const res = await fetch('http://localhost:8080/access', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       username: peerConnectionContext.username,
//     }),
//   });
//   const data = await res.json();
//   peerConnectionContext.token = data.token;
// }

// async function join() {
//   return fetch(`http://localhost:8080/${peerConnectionContext.roomId}/join`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${peerConnectionContext.token}`,
//     },
//   });
// }

// async function connect() {
//   await getToken();
//   peerConnectionContext.eventSource = new EventSource(
//     `http://localhost:8080/connect?token=${peerConnectionContext.token}`,
//   );
//   peerConnectionContext.eventSource.addEventListener(
//     'add-peer',
//     addPeer,
//     false,
//   );
//   peerConnectionContext.eventSource.addEventListener(
//     'remove-peer',
//     removePeer,
//     false,
//   );
//   peerConnectionContext.eventSource.addEventListener(
//     'session-description',
//     sessionDescription,
//     false,
//   );
//   peerConnectionContext.eventSource.addEventListener(
//     'ice-candidate',
//     iceCandidate,
//     false,
//   );
//   peerConnectionContext.eventSource.addEventListener('connected', () => {
//     join();
//   });
// }

// //! data:any 수정
// function addPeer(data: any) {
//   const message = JSON.parse(data.data);
//   if (peerConnectionContext.peers[message.peer.id]) {
//     return;
//   }

//   // setup peer connection
//   const peer: RTCPeerConnection = new RTCPeerConnection(rtcConfig);
//   peerConnectionContext.peers[message.peer.id] = peer;

//   // handle ice candidate
//   peer.onicecandidate = function (event) {
//     if (event.candidate) {
//       relay(message.peer.id, 'ice-candidate', event.candidate);
//     }
//   };

//   // generate offer if required (on join, this peer will create an offer
//   // to every other peer in the network, thus forming a mesh)
//   if (message.offer) {
//     // create the data channel, map peer updates
//     const channel = peer.createDataChannel('updates');
//     channel.onmessage = function (event) {
//       onPeerData(message.peer.id, event.data);
//     };
//     peerConnectionContext.channels[message.peer.id] = channel;
//     createOffer(message.peer.id, peer);
//   } else {
//     peer.ondatachannel = function (event) {
//       peerConnectionContext.channels[message.peer.id] = event.channel;
//       event.channel.onmessage = function (evt: MessageEvent) {
//         onPeerData(message.peer.id, evt.data);
//       };
//     };
//   }
// }

// async function createOffer(peerId: string, peer: RTCPeerConnection) {
//   const offer = await peer.createOffer();
//   await peer.setLocalDescription(offer);
//   await relay(peerId, 'session-description', offer);
// }

// function relay(peerId: string, event: string, data: any) {
//   fetch(`http://localhost:8080/relay/${peerId}/${event}`, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${peerConnectionContext.token}`,
//     },
//     body: JSON.stringify(data),
//   });
// }

// function onPeerData(id: string, data: string) {
//   const msg = JSON.parse(data);
//   actionPeerData(msg);
// }

// function broadcast(data: string) {
//   for (const peerId in peerConnectionContext.channels) {
//     // peerConnectionContext.channels[peerId].send(data);
//     if (peerConnectionContext.channels[peerId].readyState === 'open') {
//       peerConnectionContext.channels[peerId].send(data);
//     }
//   }
// }

// //! data:any 수정
// function removePeer(data: any) {
//   const message = JSON.parse(data.data);
//   if (peerConnectionContext.peers[message.peer.id]) {
//     peerConnectionContext.peers[message.peer.id].close();
//   }

//   delete peerConnectionContext.peers[message.peer.id];
// }

// //! data:any 수정
// async function sessionDescription(data: any) {
//   const message = JSON.parse(data.data);
//   const peer = peerConnectionContext.peers[message.peer.id];

//   const remoteDescription = new RTCSessionDescription(message.data);
//   await peer.setRemoteDescription(remoteDescription);
//   if (remoteDescription.type === 'offer') {
//     const answer = await peer.createAnswer();
//     await peer.setLocalDescription(answer);
//     await relay(message.peer.id, 'session-description', answer);
//   }
// }

// //! data:any 수정
// function iceCandidate(data: any) {
//   const message = JSON.parse(data.data);
//   const peer = peerConnectionContext.peers[message.peer.id];
//   peer.addIceCandidate(new RTCIceCandidate(message.data));
// }

export { load };
