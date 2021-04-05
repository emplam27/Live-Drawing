import React, { useState, useEffect } from 'react';
import {
  mouseDown,
  mouseMove,
  mouseUp,
} from '../functions/mouse-event-functions';
import { Layer } from '../../interfaces/draw-components-interfaces';
import { LayerComponentProps } from '../interfaces/layer-interfaces';
import { UserInfo } from '../../interfaces/socket-interfaces';
import '../index.css';

function LayerComponent(props: LayerComponentProps) {
  const [historyFlag, setHistoryFlag] = useState<boolean>(true);

  function selectTopLayer(layer: Layer) {
    props.setTopLayer(layer);
  }

  useEffect(() => {
    console.log(props.roomUsers);
    if (props.roomUsers !== null && props.roomUsers.users !== undefined) {
      const newLayers = props.roomUsers.users.map((user: UserInfo) => {
        return {
          name: user.userName,
          canvasId: user.userId,
          buttonId: `${user.userId}-button`,
          canvasCtx: null,
        };
      });
      props.setLayers(newLayers);
      props.setNewLayerCtxSignal(new Date().getTime());
      if (historyFlag && props.socket) {
        props.socket.emit('require-history');
        setHistoryFlag(false);
      }
    }
  }, [props.roomUsers]);

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
      <div id='layerButtonContainer'>
        {props.layers.map((layer) => {
          if (layer.canvasId !== props.roomInfo.userId)
            return (
              <span
                key={layer.canvasId}
                id={layer.buttonId}
                className={`layer_space ${
                  props.topLayer != null && props.topLayer.name === layer.name
                    ? 'active-layer'
                    : ''
                }`}
                onClick={() => selectTopLayer(layer)}
              >
                {layer.name}
              </span>
            );
        })}
      </div>
      <div
        id='canvasContainer'
        className='spacer app relative divide-x-2 divide-black canvas-container'
      >
        {props.layers.map((layer) => {
          return (
            <canvas
              key={layer.canvasId}
              id={layer.canvasId}
              className={`${
                layer.canvasId === props.roomInfo.userId
                  ? 'layer-right'
                  : 'layer-left'
              } ${
                props.topLayer !== null &&
                props.topLayer.canvasId !== layer.canvasId
                  ? 'hide'
                  : 'show'
              }`}
              width={window.innerWidth * 0.4}
              height={window.innerHeight * 0.8}
              onMouseDown={(e) => mouseDown(e)}
              onMouseMove={(e) =>
                mouseMove(
                  e,
                  props.activeTool,
                  props.color,
                  props.lineWidth,
                  props.eraserWidth,
                  props.canvasCtxTable,
                  props.socket,
                  props.roomInfo,
                )
              }
              onMouseUp={mouseUp}
            />
          );
        })}
      </div>
    </>
  );
}

export default LayerComponent;
