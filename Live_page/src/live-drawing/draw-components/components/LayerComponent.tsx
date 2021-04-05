import React, { useState, useEffect } from 'react';

import ToolbarComponent from './ToolbarComponent';
import '../index.css';

import { Layer } from '../../interfaces/draw-components-interfaces';
import { LayerComponentProps } from '../interfaces/layer-interfaces';
import { UserInfo } from '../../interfaces/socket-interfaces';

import {
  mouseDown,
  mouseMove,
  mouseUp,
} from '../functions/mouse-event-functions';

function LayerComponent(props: LayerComponentProps) {
  const [activeTool, setActiveTool] = useState<string>('');
  const [color, setColor] = useState('#000000');
  const [eraserWidth, setEraserWidth] = useState(30);
  const [lineWidth, setLineWidth] = useState(5);
  const [historyFlag, setHistoryFlag] = useState<boolean>(true);

  //@ roomData가 업데이트 될 때마다 layers를 재구성, layer 추가&삭제 역할수행
  useEffect(() => {
    // console.log(props.roomUsers);
    if (props.roomUsers === null || props.roomUsers.users === undefined) return;

    const newLayers = props.roomUsers.users.map((user: UserInfo) => {
      const newLayer: Layer = {
        name: user.userName,
        canvasId: user.userId,
        buttonId: `${user.userId}-button`,
        canvasCtx: null,
      };
      return newLayer;
    });
    props.setLayers(newLayers);
    props.setNewLayerCtxSignal(new Date().getTime());

    // 새로운 연결인 경우에는 history data 요청
    if (historyFlag && props.socket) {
      props.socket.emit('require-history');
      setHistoryFlag(false);
    }
  }, [props.roomUsers]);

  //@ layer가 생성되면, canvasContext를 가지고 있지 않은 layer를 찾아 연결
  useEffect(() => {
    // 마지막에 추가되는 canvas에 대해서 layers에 ctx 저장하기
    const layersLength: number = props.layers.length;
    if (layersLength === 0 || props.newLayerCtxSignal === null) return;

    const tmpCanvasCtxTable = { ...props.canvasCtxTable };
    const tmpLayers = [...props.layers];
    for (const layer of tmpLayers) {
      if (layer.canvasCtx) continue;

      const canvas: HTMLElement | null = document.getElementById(
        layer.canvasId,
      );
      if (!canvas) continue;

      const ctx: CanvasRenderingContext2D | null = (canvas as HTMLCanvasElement).getContext(
        '2d',
      );
      if (!ctx) continue;

      // layer와 CanvasCtxTable에 ctx 추가하기
      layer.canvasCtx = ctx;
      tmpCanvasCtxTable[layer.canvasId] = layer.canvasCtx;
    }
    props.setLayers(tmpLayers);
    props.setCanvasCtxTable(tmpCanvasCtxTable);
  }, [props.newLayerCtxSignal]);

  return (
    <>
      <div
        id='canvasContainer'
        className='spacer app relative canvas-container grid grid-cols-2 divide-x-2'
      >
        {props.layers.map((layer: Layer) => {
          return (
            <canvas
              key={layer.canvasId}
              id={layer.canvasId}
              className={`${
                layer.canvasId === props.roomInfo.userId
                  ? 'layer-right cols-start-2 cols-end-3 border-8 border-indigo-600'
                  : 'layer-left cols-start-1 cols-end-2 border-8 border-red-600'
              } ${
                props.activeLayer !== null &&
                props.activeLayer.canvasId !== layer.canvasId
                  ? 'hide'
                  : 'show'
              }`}
              width={window.innerWidth * 0.4}
              height={window.innerHeight}
              onMouseDown={(e) => mouseDown(e)}
              onMouseUp={mouseUp}
              onMouseMove={(e) =>
                mouseMove(
                  e,
                  activeTool,
                  color,
                  lineWidth,
                  eraserWidth,
                  props.canvasCtxTable,
                  props.socket,
                  props.roomInfo,
                )
              }
            />
          );
        })}
      </div>
      <ToolbarComponent
        activeTool={activeTool}
        color={color}
        cursorWidth={props.cursorWidth}
        eraserWidth={eraserWidth}
        lineWidth={lineWidth}
        setActiveTool={setActiveTool}
        setColor={setColor}
        setCursorWidth={props.setCursorWidth}
        setEraserWidth={setEraserWidth}
        setLineWidth={setLineWidth}
      />
    </>
  );
}

export default LayerComponent;
