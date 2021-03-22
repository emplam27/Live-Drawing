import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { down, move, up, key, forceChanged } from '../../functions/draw';
import { setRoomKey, broadcast, connect } from '../../connections/load';
import './index.css';
import LayerComponent from './components/LayerComponent';
import CursorComponent from './components/CursorComponent';
import EraseSizeComponent from './components/EraseSizeComponent';
import LineSizeComponent from './components/LineSizeComponent';
import ToolSelectComponent from './components/ToolSelectComponent';
import ColorPaletteComponent from './components/ColorPaletteComponent';

// import styled from 'styled-components';
function Draw() {
  // For Connection Variables

  interface Params {
    roomKey: string;
  }

  const { roomKey } = useParams<Params>();

  setRoomKey(roomKey);

  // For Canvas Variables

  interface Layer {
    name: string;
    id: string;
    buttonId: string;
  }

  interface point {
    x: number;
    y: number;
  }

  let canvas: HTMLCanvasElement;
  let canvasContainer, layerButtonContainer, activeToolElement: HTMLElement;
  let swatchContainer, colorIndex, colorPicker, colorElements: HTMLElement, slider;

  const [lineWidth, setLineWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(5);
  const [cursorWidth, setCursorWidth] = useState(5);
  const pathsry: point[][] = [];
  const points: point[] = [];

  const [layers, setLayers] = useState<Layer[]>([]);
  const [layerCount, setLayerCount] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState({});
  const [activeTool, setActiveTool] = useState('pencil');
  const [color, setColor] = useState('#000000');
  const [ctx, setCtx] = useState({});

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

  useEffect(() => {
    connect();
  }, []);

  return (
    <div>
      <p>Draw component</p>
      <CursorComponent cursorWidth={cursorWidth} />
      <div className='flush vstack'>
        <div className='menubar hstack'>
          <ToolSelectComponent setActiveTool={setActiveTool} />
          <LineSizeComponent cursorWidth={cursorWidth} setLineWidth={setLineWidth} setCursorWidth={setCursorWidth} />
          <EraseSizeComponent
            cursorWidth={cursorWidth}
            setEraserWidth={setEraserWidth}
            setCursorWidth={setCursorWidth}
          />
          <div className='spacer'></div>
          <ColorPaletteComponent color={color} />
          <div className='spacer'></div>
        </div>
        <LayerComponent layers={layers} layerCount={layerCount} ctx={ctx} activeLayer={activeLayer} />
      </div>
    </div>
  );
}

export default Draw;
