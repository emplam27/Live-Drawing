import React, { useState, useEffect, useRef } from 'react';
import { isCompositeComponentWithType } from 'react-dom/test-utils';
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
        urls: [
          'stun:stun.l.google.com:19302',
          'stun:global.stun.twilio.com:3478',
        ],
      },
    ],
  };

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
    context.eventSource = new EventSource(
      `http://localhost:8081/connect?token=${context.token}`
    );
    context.eventSource.addEventListener('add-peer', addPeer, false);
    context.eventSource.addEventListener('remove-peer', removePeer, false);
    context.eventSource.addEventListener(
      'session-description',
      sessionDescription,
      false
    );
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

  // function peerDataUpdates(peerId, data) {
  //   onPeerData(peerId, data.data)
  // }

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

  // For Canvas Variables

  let canvasContainerRef = useRef(null);
  let layerButtonContainerRef = useRef(null);
  // let activeCanvasRef = useRef(null);
  let activeToolElementRef = useRef(null);
  let swatchContainerRef = useRef(null);
  let canvasContainer, layerButtonContainer, activeToolElement;
  let swatchContainer, colorIndex, colorPicker, colorElements;

  let lastPoint;
  let originPoint;
  let force = 1;
  let mouseDown = false;
  let activeShape;

  const swatch = [
    [
      '#000000',
      '#434343',
      '#666666',
      '#999999',
      '#b7b7b7',
      '#cccccc',
      '#d9d9d9',
      '#efefef',
      '#f3f3f3',
      '#ffffff',
    ],
    [
      '#980000',
      '#ff0000',
      '#ff9900',
      '#ffff00',
      '#00ff00',
      '#00ffff',
      '#4a86e8',
      '#0000ff',
      '#9900ff',
      '#ff00ff',
    ],
    [
      '#e6b8af',
      '#f4cccc',
      '#fce5cd',
      '#fff2cc',
      '#d9ead3',
      '#d0e0e3',
      '#c9daf8',
      '#cfe2f3',
      '#d9d2e9',
      '#ead1dc',
    ],
    [
      '#dd7e6b',
      '#ea9999',
      '#f9cb9c',
      '#ffe599',
      '#b6d7a8',
      '#a2c4c9',
      '#a4c2f4',
      '#9fc5e8',
      '#b4a7d6',
      '#d5a6bd',
    ],
    [
      '#cc4125',
      '#e06666',
      '#f6b26b',
      '#ffd966',
      '#93c47d',
      '#76a5af',
      '#6d9eeb',
      '#6fa8dc',
      '#8e7cc3',
      '#c27ba0',
    ],
    [
      '#a61c00',
      '#cc0000',
      '#e69138',
      '#f1c232',
      '#6aa84f',
      '#45818e',
      '#3c78d8',
      '#3d85c6',
      '#674ea7',
      '#a64d79',
    ],
    [
      '#85200c',
      '#990000',
      '#b45f06',
      '#bf9000',
      '#38761d',
      '#134f5c',
      '#1155cc',
      '#0b5394',
      '#351c75',
      '#741b47',
    ],
    [
      '#5b0f00',
      '#660000',
      '#783f04',
      '#7f6000',
      '#274e13',
      '#0c343d',
      '#1c4587',
      '#073763',
      '#20124d',
      '#4c1130',
    ],
  ];
  const colorMap = swatch.flat();

  let layerCount = 1;
  let activeLayer = null;
  let activeTool = 'pencil';
  let color = '#000000';
  let ctx = null;
  let layers = [];
  // const [layers, setLayers] = useState([]);
  // const [layerCount, setLayerCount] = useState(1);
  // const [activeLayer, setActiveLayer] = useState({});
  // const [activeTool, setActiveTool] = useState('pencil');
  // const [color, setColor] = useState('#000000');
  // const [ctx, setCtx] = useState({});

  // For Canvas Functions

  // function resize() {
  //   canvas.width = window.innerWidth;
  //   canvas.height = window.innerHeight;
  //   // activeCanvas.width = window.innerWidth;
  //   // activeCanvas.height = window.innerHeight;
  // }

  function onPeerData(id, data) {
    let msg = JSON.parse(data);
    if (msg.event === 'draw') {
      draw(msg);
    } else if (msg.event === 'drawRect') {
      drawRect(msg);
    } else if (msg.event === 'clear') {
      // ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  function draw(data) {
    ctx.beginPath();
    ctx.moveTo(data.lastPoint.x, data.lastPoint.y);
    ctx.lineTo(data.x, data.y);
    ctx.strokeStyle = color;
    ctx.lineWidth = Math.pow(data.force || 1, 4) * 2;
    ctx.lineCap = 'round';
    ctx.stroke();
    ctx.closePath();
  }

  function drawRect(data, commit) {
    // activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);
    if (data.commit || commit) {
      ctx.strokeStyle = data.color;
      ctx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
    } else {
      // activeCtx.strokeStyle = data.color;
      // activeCtx.strokeRect(data.origin.x, data.origin.y, data.width, data.height);
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
          color: color,
        });

        broadcast(
          JSON.stringify({
            event: 'draw',
            lastPoint,
            x: e.offsetX,
            y: e.offsetY,
            force: force,
            color: color,
          })
        );
      } else if (activeTool === 'rect') {
        let origin = {
          x: Math.min(originPoint.x, e.offsetX),
          y: Math.min(originPoint.y, e.offsetY),
        };
        drawRect({
          origin: origin,
          color: color,
          width: Math.abs(originPoint.x - e.offsetX),
          height: Math.abs(originPoint.y - e.offsetY),
        });
        broadcast(
          JSON.stringify({
            event: 'drawRect',
            origin: origin,
            color: color,
            width: Math.abs(originPoint.x - e.offsetX),
            height: Math.abs(originPoint.y - e.offsetY),
          })
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
            activeShape
          )
        )
      );
      activeShape = undefined;
    }
    lastPoint = undefined;
    originPoint = undefined;
  }

  function key(e) {
    // console.log(e);
    // if (e.key === 'Backspace') {
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    //   broadcast(
    //     JSON.stringify({
    //       event: 'clear',
    //     })
    //   );
    // }
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
    // if (
    //   mouseDown &&
    //   (e.key === 'ArrowUp' ||
    //     (e.shiftKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)))
    // ) {
    //   force += 0.025;
    // }
    // if (
    //   mouseDown &&
    //   (e.key === 'ArrowDown' ||
    //     (e.altKey && ['ArrowLeft', 'ArrowRight'].includes(e.key)))
    // ) {
    //   force -= 0.025;
    // }
  }

  function forceChanged(e) {
    force = e.webkitForce || 1;
  }

  function randomColor() {
    return parseInt(Math.random() * colorMap.length);
  }

  function createLayer() {
    canvasContainer = canvasContainerRef.current;
    layerButtonContainer = layerButtonContainerRef.current;

    const newLayer = {
      name: `layer-${layerCount}`,
      id: `layer-id-${layerCount}`,
      buttonId: `layer-id-${layerCount}-button`,
    };

    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('layer');
    canvas.id = `layer-id-${layerCount}`;
    canvas.addEventListener('mousedown', down);
    canvas.addEventListener('mousemove', move);
    canvas.addEventListener('mouseup', up);
    canvas.addEventListener('keydown', key);
    canvas.addEventListener('webkitmouseforcechanged', forceChanged);
    canvasContainer.appendChild(canvas);

    const button = document.createElement('span');
    button.classList.add('layer_space');
    button.dataset.name = newLayer.name;
    button.dataset.id = newLayer.id;
    button.dataset.buttonId = newLayer.buttonId;
    button.addEventListener('click', function (e) {
      const tmpLayer = {
        name: e.target.dataset.name,
        id: e.target.dataset.id,
        buttonId: e.target.dataset.buttonId,
      };
      selectActiveLayer(tmpLayer);
    });
    button.id = `${newLayer.id}-button`;
    button.innerText = `${newLayer.name}`;
    layerButtonContainer.appendChild(button);

    // 새로 만들어진 layer를 activeLayer로 바꾸기
    if (activeLayer === null) {
      button.classList.add('active-layer');
      ctx = canvas.getContext('2d');
      activeLayer = newLayer;
    } else {
      selectActiveLayer(newLayer);
    }
    // setCtx(canvas.getContext('2d'));
    // layers에 추가해주고, count 갱신
    layers.push(newLayer);
    layerCount += 1;
    // resize();
  }

  function deleteLayer() {
    // 액티브 된 캔버스 삭제
    if (layers.length === 1) {
      return;
    }
    // 맨 뒤에 있는 액티브로 getcontext 변경한다.
    const targetCanvas = document.getElementById(activeLayer.id);
    targetCanvas.remove();
    const targetButton = document.getElementById(activeLayer.buttonId);
    targetButton.remove();
    let index = layers.indexOf(activeLayer);
    layers.splice(index, 1);
    if (index === layers.length) {
      index -= 1;
    }
    selectActiveLayer(layers[0]);
  }

  function selectActiveLayer(layer) {
    const oldButton = document.getElementById(activeLayer.buttonId);
    if (oldButton) {
      oldButton.classList.remove('active-layer');
    }

    const newCanvas = document.getElementById(layer.id);
    const newButton = document.getElementById(layer.buttonId);
    newButton.classList.add('active-layer');

    ctx = newCanvas.getContext('2d');
    activeLayer = layer;
  }

  useEffect(() => {
    connect();

    // Layer
    createLayer();

    activeToolElement = activeToolElementRef.current;

    document.querySelectorAll('[data-tool]').forEach((tool) => {
      tool.onclick = function (e) {
        activeToolElement.classList.toggle('active');
        activeToolElement = tool;
        activeToolElement.classList.toggle('active');
        activeTool = activeToolElement.dataset.tool;
      };
    });

    // color picker
    swatchContainer = swatchContainerRef.current;
    colorPicker = document.querySelector('[data-color]');
    colorElements = {};

    swatch.forEach((row) => {
      let rowElem = document.createElement('div');
      rowElem.classList.add('hstack');

      row.forEach((c) => {
        let elem = document.createElement('div');
        elem.classList.add('box');
        elem.classList.add('color-' + c.substr(1));
        elem.style.backgroundColor = c;
        elem.onclick = function (e) {
          colorPicker.dataset.color = c;
          colorPicker.style.color = c;
          if (colorElements[color]) {
            colorElements[color].classList.remove('active');
          }

          color = c;
          elem.classList.toggle('active');
          // e.preventDefault();
        };
        colorElements[c] = elem;
        rowElem.appendChild(elem);
      });

      swatchContainer.appendChild(rowElem);
    });

    colorPicker.dataset.color = color;
    colorPicker.style.color = color;
    colorElements[color].classList.add('active');

    //Our first draw
    // resize();
  }, []);

  return (
    <div>
      <p>Draw component</p>
      <div className="flush vstack">
        <div className="menubar hstack">
          <p className="icon-link center">
            <i className="ri-lg ri-landscape-line"></i>
          </p>
          <div className="spacer"></div>
          <p
            ref={activeToolElementRef}
            className="icon-link active center"
            data-tool="pencil"
          >
            <i className="ri-xl ri-pencil-fill"></i>
          </p>
          <p className="icon-link center" data-tool="rect">
            <i className="ri-xl ri-shape-line"></i>
          </p>
          <p className="icon-link center" data-tool="circle">
            <i className="ri-xl ri-checkbox-blank-circle-line"></i>
          </p>
          <p className="icon-link center" data-tool="text">
            <i className="ri-xl ri-font-size-2"></i>
          </p>
          <p className="icon-link center" data-tool="layer">
            <i className="ri-xl ri-stack-line"></i>
          </p>
          <div className="spacer"></div>
          <div className="relative">
            <p className="icon-link center" data-color="#33ffff">
              <i className="ri-xl ri-palette-line"></i>
              <i className="ri-xl ri-checkbox-blank-fill center"></i>
            </p>
            <div
              ref={swatchContainerRef}
              id="color-picker"
              className="dropdown vstack"
            ></div>
          </div>
          <div className="spacer"></div>
        </div>
        <div>
          <button className="button" onClick={createLayer}>
            make layer
          </button>
          <button className="button" onClick={deleteLayer}>
            delete layer
          </button>
          <div ref={layerButtonContainerRef} id="layerButtonContainer"></div>
        </div>
        <div
          ref={canvasContainerRef}
          id="canvasContainer"
          className="spacer app relative"
        ></div>
      </div>
    </div>
  );
};

export default Draw;
