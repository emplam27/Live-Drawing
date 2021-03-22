import React, { useState, useEffect, useRef } from 'react';
import { down, move, up, key, forceChanged } from '../../../functions/draw';
import '../index.css';

interface Layer {
  name: string;
  id: string;
  buttonId: string;
}

interface LayerComponentProps {
  layers: Layer[];
  layerCount: number;
  ctx: any;
  activeLayer: any;
}

function LayerComponent({ layers, layerCount, ctx, activeLayer }: LayerComponentProps) {
  const canvasContainerRef = useRef(null);
  const layerButtonContainerRef = useRef(null);
  function createLayer() {
    console.log('create layer');
    const canvasContainer: any = canvasContainerRef.current;
    const layerButtonContainer: any = layerButtonContainerRef.current;

    const newLayer: Layer = {
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
    button.addEventListener('click', function (e: any) {
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
    const targetCanvas: any = document.getElementById(activeLayer.id);
    targetCanvas.remove();
    const targetButton: any = document.getElementById(activeLayer.buttonId);
    targetButton.remove();
    let index = layers.indexOf(activeLayer);
    console.log('delete layer : active layer');
    console.log(activeLayer);
    layers.splice(index, 1);
    if (index === layers.length) {
      index -= 1;
      if (index === -1) {
        index = 0;
      }
    }
    console.log('delete_layer : layers');
    console.log(layers);
    selectActiveLayer(layers[0]);
  }

  function selectActiveLayer(layer: any) {
    const oldButton = document.getElementById(activeLayer.buttonId);
    if (oldButton) {
      oldButton.classList.remove('active-layer');
    }

    const newCanvas: any = document.getElementById(layer.id);
    const newButton: any = document.getElementById(layer.buttonId);
    newButton.classList.add('active-layer');

    ctx = newCanvas.getContext('2d');
    activeLayer = layer;
  }

  useEffect(() => {
    createLayer();
  }, []);

  return (
    <>
      <div>
        <button className='button' onClick={createLayer}>
          make layer
        </button>
        <button className='button' onClick={deleteLayer}>
          delete layer
        </button>
        <div ref={layerButtonContainerRef} id='layerButtonContainer'></div>
      </div>
      <div ref={canvasContainerRef} id='canvasContainer' className='spacer app relative'></div>
    </>
  );
}

export default LayerComponent;
