import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import './index.css';

const Draw = () => {
  // For Connection Variables
  let { roomKey } = useParams();

  let context = {
    username: 'user' + parseInt(Math.random() * 100000),
    roomId: roomKey,
    token: null,
    eventSource: null,
    peers: {},
    channels: {},
  };

  const rtcConfig = {
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302', 'stun:global.stun.twilio.com:3478'],
      },
    ],
  };

  // For Canvas Variables
  let canvasRef = useRef(null);
  let activeCanvasRef = useRef(null);
  let activeToolElementRef = useRef(null);
  let canvas, activeCanvas, ctx, activeCtx, activeTool, activeToolElement;

  let lastPoint;
  let originPoint;
  let force = 1;
  let mouseDown = false;
  let activeShape;

  const swatch = [
    ['#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff'],
    ['#980000', '#ff0000', '#ff9900', '#ffff00', '#00ff00', '#00ffff', '#4a86e8', '#0000ff', '#9900ff', '#ff00ff'],
    ['#e6b8af', '#f4cccc', '#fce5cd', '#fff2cc', '#d9ead3', '#d0e0e3', '#c9daf8', '#cfe2f3', '#d9d2e9', '#ead1dc'],
    ['#dd7e6b', '#ea9999', '#f9cb9c', '#ffe599', '#b6d7a8', '#a2c4c9', '#a4c2f4', '#9fc5e8', '#b4a7d6', '#d5a6bd'],
    ['#cc4125', '#e06666', '#f6b26b', '#ffd966', '#93c47d', '#76a5af', '#6d9eeb', '#6fa8dc', '#8e7cc3', '#c27ba0'],
    ['#a61c00', '#cc0000', '#e69138', '#f1c232', '#6aa84f', '#45818e', '#3c78d8', '#3d85c6', '#674ea7', '#a64d79'],
    ['#85200c', '#990000', '#b45f06', '#bf9000', '#38761d', '#134f5c', '#1155cc', '#0b5394', '#351c75', '#741b47'],
    ['#5b0f00', '#660000', '#783f04', '#7f6000', '#274e13', '#0c343d', '#1c4587', '#073763', '#20124d', '#4c1130'],
  ];
  const colorMap = swatch.flat();

  // For Connection Functions
  async function getToken() {
    let res = await fetch('http://localhost:8081/access', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: context.username,
      }),
    });
    let data = await res.json();
    context.token = data.token;
  }

  async function join() {
    return fetch(`http://localhost:8081/${context.roomId}/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${context.token}`,
      },
    });
  }

  async function connect() {
    await getToken();
    context.eventSource = new EventSource(`http://localhost:8081/connect?token=${context.token}`);
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
    fetch(`http://localhost:8081/relay/${peerId}/${event}`, {
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
      // context.channels[peerId].send(data);
      if (context.channels[peerId].readyState === 'open') {
        context.channels[peerId].send(data);
      }
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

  // For Canvas Functions

  // let swatchContainer = document.querySelector('#color-picker');
  // let colorElements = {};
  // swatch.forEach((row) => {
  //   let rowElem = document.createElement('div');
  //   rowElem.classList.add('hstack');
  //   row.forEach((c) => {
  //     let elem = document.createElement('div');
  //     elem.classList.add('box');
  //     elem.classList.add('color-' + c.substr(1));
  //     elem.style.backgroundColor = c;
  //     elem.onclick = function (e) {
  //       colorPicker.dataset.color = c;
  //       colorPicker.style.color = c;
  //       if (colorElements[color]) {
  //         colorElements[color].classList.remove('active');
  //       }
  //       color = c;
  //       elem.classList.toggle('active');
  //       e.preventDefault();
  //     };
  //     colorElements[c] = elem;
  //     rowElem.appendChild(elem);
  //   });

  //   swatchContainer.appendChild(rowElem);
  // });

  // function randomColor() {
  //   return parseInt(Math.random() * colorMap.length);
  // }

  // var colorIndex = randomColor();
  // var color = colorMap[colorIndex];
  // var colorPicker = document.querySelector('[data-color]');
  // colorPicker.dataset.color = color;
  // colorPicker.style.color = color;
  // colorElements[color].classList.add('active');

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    activeCanvas.width = window.innerWidth;
    activeCanvas.height = window.innerHeight;
  }

  function onPeerData(id, data) {
    let msg = JSON.parse(data);
    if (msg.event === 'draw') {
      draw(msg);
    } else if (msg.event === 'drawRect') {
      drawRect(msg);
    } else if (msg.event === 'clear') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
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

  function drawRect(data, commit) {
    activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
    if (data.commit || commit) {
      ctx.strokeStyle = data.color;
      ctx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
    } else {
      activeCtx.strokeStyle = data.color;
      activeCtx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
    }
    activeShape = data;
  }

  function move(e) {
    mouseDown = e.buttons;
    if (e.buttons) {
      if (!lastPoint) {
        lastPoint = { x: e.offsetX, y: e.offsetY };
        originPoint = { x: e.offsetX, y: e.offsetY };
        return;
      }

      if (activeTool === 'pencil') {
        draw({
          lastPoint,
          x: e.offsetX,
          y: e.offsetY,
          force: force,
          color: '#f1c232',
        });

        broadcast(
          JSON.stringify({
            event: 'draw',
            lastPoint,
            x: e.offsetX,
            y: e.offsetY,
            force: force,
            color: '#f1c232',
          }),
        );
      } else if (activeTool === 'rect') {
        let origin = {
          x: Math.min(originPoint.x, e.offsetX),
          y: Math.min(originPoint.y, e.offsetY),
        };
        drawRect({
          origin: origin,
          color: '#f1c232',
          width: Math.abs(originPoint.x - e.offsetX),
          height: Math.abs(originPoint.y - e.offsetY),
        });
        broadcast(
          JSON.stringify({
            event: 'drawRect',
            origin: origin,
            color: '#f1c232',
            width: Math.abs(originPoint.x - e.offsetX),
            height: Math.abs(originPoint.y - e.offsetY),
          }),
        );
      }

      lastPoint = { x: e.offsetX, y: e.offsetY };
    } else {
      lastPoint = undefined;
    }
  }

  function down(e) {
    originPoint = { x: e.offsetX, y: e.offsetY };
  }

  function up() {
    if (activeShape) {
      drawRect(activeShape, true);
      broadcast(
        JSON.stringify(
          Object.assign(
            {
              event: 'drawRect',
              commit: true,
            },
            activeShape,
          ),
        ),
      );
      activeShape = undefined;
    }
    lastPoint = undefined;
    originPoint = undefined;
  }

  function key(e) {
    if (e.key === 'Backspace') {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      broadcast(
        JSON.stringify({
          event: 'clear',
        }),
      );
    }
    // if (e.key === 'ArrowRight') {
    //   colorIndex++;
    // }
    // if (e.key === 'ArrowLeft') {
    //   colorIndex--;
    // }
    // if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
    //   if (colorIndex >= colorMap.length) {
    //     colorIndex = 0;
    //   }
    //   if (colorIndex < 0) {
    //     colorIndex = colorMap.length - 1;
    //   }
    //   if (colorElements[color]) {
    //     colorElements[color].classList.remove('active');
    //   }
    //   color = colorMap[colorIndex];
    //   colorPicker.dataset.color = color;
    //   colorPicker.style.color = color;
    //   colorElements[color].classList.toggle('active');
    // }
    if (mouseDown && (e.key === 'ArrowUp' || (e.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)))) {
      force += 0.025;
    }
    if (mouseDown && (e.key === 'ArrowDown' || (e.altKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)))) {
      force -= 0.025;
    }
  }

  function forceChanged(e) {
    force = e.webkitForce || 1;
  }

  useEffect(() => {
    connect();

    canvas = canvasRef.current;
    activeCanvas = activeCanvasRef.current;
    ctx = canvas.getContext('2d');
    activeCtx = activeCanvas.getContext('2d');

    canvas.addEventListener('mousedown', down);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', up);
    canvas.addEventListener('keydown', key);
    canvas.addEventListener('webkitmouseforcechanged', forceChanged);

    activeToolElement = activeToolElementRef.current;
    activeTool = activeToolElement.dataset.tool;

    document.querySelectorAll('[data-tool]').forEach((tool) => {
      tool.onclick = function (e) {
        activeToolElement.classList.toggle('active');
        activeToolElement = tool;
        activeToolElement.classList.toggle('active');
        activeTool = activeToolElement.dataset.tool;
      };
    });

    //Our first draw
    resize();
  }, []);

  return (
    <div>
      <p>Draw component</p>
      <div className='flush vstack'>
        <div className='menubar hstack'>
          <a className='icon-link center'>
            <i className='ri-lg ri-landscape-line'></i>
          </a>
          <div className='spacer'></div>
          <a ref={activeToolElementRef} className='icon-link active center' data-tool='pencil'>
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
          <canvas ref={canvasRef}></canvas>
          <canvas ref={activeCanvasRef} className='active'></canvas>
        </div>
      </div>
    </div>
  );
};

export default Draw;
