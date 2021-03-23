import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { setRoomKey, connect } from '../../connections/load';
import { CanvasCtxProvider } from './DrawContext';
import './index.css';
// import styled from 'styled-components';

import LayerComponent from './components/LayerComponent';
import CursorComponent from './components/CursorComponent';
import EraseSizeComponent from './components/EraseSizeComponent';
import LineSizeComponent from './components/LineSizeComponent';
import ToolSelectComponent from './components/ToolSelectComponent';
import ColorPaletteComponent from './components/ColorPaletteComponent';

interface Params {
  roomKey: string;
}

interface Layer {
  name: string;
  id: string;
  buttonId: string;
}

// interface point {
//   x: number;
//   y: number;
// }

function Draw() {
  const { roomKey } = useParams<Params>();
  setRoomKey(roomKey);

  const [lineWidth, setLineWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(5);
  const [cursorWidth, setCursorWidth] = useState(5);
  // const [pathsry, setPathsry] = useState<point[][]>([]);
  // const [points, setPoints] = useState<point[]>([]);

  const [color, setColor] = useState('#000000');
  const [activeTool, setActiveTool] = useState('pencil');
  const [layers, setLayers] = useState<Layer[]>([]);
  const [layerCount, setLayerCount] = useState<number>(1);
  const [activeLayer, setActiveLayer] = useState(null);
  const [canvas, setCanvas] = useState<any>(null);

  //! 하나의 ctx를 사용, 전역으로 사용하기 위해 Context API 사용
  //! 레이어 마다 하나씩 가지고 있는 방법으로 바꿔야함
  // const [canvasCtxs] = useContext(canvasCtxContext);
  // const [canvasCtx, setCanvasCtx] = useState(null);

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
        <CanvasCtxProvider>
          <LayerComponent
            activeTool={activeTool}
            color={color}
            lineWidth={lineWidth}
            eraserWidth={eraserWidth}
            layers={layers}
            canvas={canvas}
            layerCount={layerCount}
            activeLayer={activeLayer}
            // canvasCtx={canvasCtx}
            setLayers={setLayers}
            setCanvas={setCanvas}
            setLayerCount={setLayerCount}
            setActiveLayer={setActiveLayer}
            // setCanvasCtx={setCanvasCtx}
          />
        </CanvasCtxProvider>
      </div>
    </div>
  );
}

export default Draw;
