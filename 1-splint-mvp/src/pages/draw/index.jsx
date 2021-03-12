import React, { useEffect, useRef } from 'react';
import './index.css';

const Draw = () => {
  var context = {
    username: 'user' + parseInt(Math.random() * 100000),
    roomId: window.location.pathname.substr(1),
    token: null,
    eventSource: null,
    //   peers: {},
    //   channels: {},
  };

  const rtcConfig = {
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'],
      },
    ],
  };

  async function getToken() {
    let res = await fetch('/access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: context.username,
      }),
    });
    let data = await res.json();
    context.token = data;
  }

  async function join() {
    return fetch(`/${context.roomId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.token}`,
      },
    });
  }

  async function connect() {
    await getToken();
    context.eventSource = new EventSource(`/connect?token=${context.token}`);
    context.eventSource.addEventListener('add-peer', addPeer, false);
    context.eventSource.addEventListener('remove-peer', removePeer, false);
    context.eventSource.addEventListener('session-description', sessionDescription, false);
    context.eventSource.addEventListener('ice-candidate', iceCandidate, false);
    context.eventSource.addEventListener('connected', () => {
      join();
    });
  }

  function addPeer(data) {
    let message = JSON.parse(data.data);
    if (context.peers[message.peer.id]) {
      return;
    }

    // setup peer connection
    let peer = new RTCPeerConnection(rtcConfig);
    context.peers[message.peer.id] = peer;

    // handle ice candidate
    peer.onicecandidate = function (event) {
      if (event.candidate) {
        relay(message.peer.id, 'ice-candidate', event.candidate);
      }
    };

    // generate offer if required (on join, this peer will create an offer
    // to every other peer in the network, thus forming a mesh)
    if (message.offer) {
      // create the data channel, map peer updates
      let channel = peer.createDataChannel('updates');
      channel.onmessage = function (event) {
        onPeerData(message.peer.id, event.data);
      };
      context.channels[message.peer.id] = channel;
      createOffer(message.peer.id, peer);
    } else {
      peer.ondatachannel = function (event) {
        context.channels[message.peer.id] = event.channel;
        event.channel.onmessage = function (evt) {
          onPeerData(message.peer.id, evt.data);
        };
      };
    }
  }

  async function createOffer(peerId, peer) {
    let offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    await relay(peerId, 'session-description', offer);
  }

  function relay(peerId, event, data) {
    fetch(`/relay/${peerId}/${event}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.token}`,
      },
      body: JSON.stringify(data),
    });
  }

  function peerDataUpdates(peerId, data) {
    onPeerData(peerId, data.data);
  }

  function broadcast(data) {
    for (let peerId in context.channels) {
      context.channels[peerId].send(data);
      // if (context.channels[peerId].readyState === "open") {
      //   context.channels[peerId].send(data);
      // }
    }
  }

  function removePeer(data) {
    let message = JSON.parse(data.data);
    if (context.peers[message.peer.id]) {
      context.peers[message.peer.id].close();
    }

    delete context.peers[message.peer.id];
  }

  async function sessionDescription(data) {
    let message = JSON.parse(data.data);
    let peer = context.peers[message.peer.id];

    let remoteDescription = new RTCSessionDescription(message.data);
    await peer.setRemoteDescription(remoteDescription);
    if (remoteDescription.type === 'offer') {
      let answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      await relay(message.peer.id, 'session-description', answer);
    }
  }

  function iceCandidate(data) {
    let message = JSON.parse(data.data);
    let peer = context.peers[message.peer.id];
    peer.addIceCandidate(new RTCIceCandidate(message.data));
  }

  connect();

  // const canvas = document.querySelector('canvas');
  const canvasRef = useRef(null);
  // const canvas = canvasRef.current;
  // const ctx = canvas.getContext('2d');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    //Our first draw
    resize();
  }, []);

  var lastPoint;
  var force;

  function randomColor() {
    let r = Math.random() * 255;
    let g = Math.random() * 255;
    let b = Math.random() * 255;
    return `rgb(${r}, ${g}, ${b})`;
  }

  var color = randomColor();
  var colorPicker = document.querySelector('[data-color]');
  // colorPicker.dataset.color = color;
  // colorPicker.style.color = color;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function onPeerData(id, data) {
    draw(JSON.parse(data));
  }

  function draw(data) {
    ctx.beginPath();
    ctx.moveTo(data.lastPoint.x, data.lastPoint.y);
    ctx.lineTo(data.x, data.y);
    ctx.strokeStyle = data.color;
    ctx.lineWidth = Math.pow(data.force || 1, 4) * 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
  }

  function move(e) {
    if (e.buttons) {
      if (!lastPoint) {
        lastPoint = { x: e.offsetX, y: e.offsetY };
        return;
      }

      draw({
        lastPoint,
        x: e.offsetX,
        y: e.offsetY,
        force: force,
        color: color,
      });

      broadcast(
        JSON.stringify({
          lastPoint,
          x: e.offsetX,
          y: e.offsetY,
          force: force,
          color: color,
        }),
      );

      lastPoint = { x: e.offsetX, y: e.offsetY };
    }
  }

  function up() {
    lastPoint = undefined;
  }

  function key(e) {
    if (e.key === 'Backspace') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function forceChanged(e) {
    force = e.webkitForce || 1;
  }

  window.onresize = resize;
  window.onmousemove = move;
  window.onmouseup = up;
  window.onkeydown = key;

  window.onwebkitmouseforcechanged = forceChanged;

  return (
    <div>
      <p>Draw component</p>
      <div className='flush vstack'>
        <div className='menubar hstack'>
          <a className='icon-link center'>
            <i className='ri-lg ri-landscape-line'></i>
          </a>
          <div className='spacer'></div>
          <a className='icon-link active center' data-tool='pencil'>
            <i className='ri-lg ri-pencil-fill'></i>
          </a>
          <a className='icon-link center' data-tool='rect'>
            <i className='ri-lg ri-shape-line'></i>
          </a>
          <a className='icon-link center' data-tool='circle'>
            <i className='ri-lg ri-checkbox-blank-circle-line'></i>
          </a>
          <a className='icon-link center' data-tool='text'>
            <i className='ri-lg ri-font-size-2'></i>
          </a>
          <div className='spacer'></div>
          <div className='relative'>
            <a className='icon-link center' data-color='#33ffff'>
              <i className='ri-lg ri-palette-line'></i>
              <i className='ri-lg ri-checkbox-blank-fill center'></i>
            </a>
            <div id='color-picker' className='dropdown vstack'></div>
          </div>
          <div className='spacer'></div>
        </div>
        <div className='spacer app'>
          <canvas></canvas>
          <canvas ref={canvasRef} className='active'></canvas>
        </div>
      </div>
    </div>
  );
};

export default Draw;
