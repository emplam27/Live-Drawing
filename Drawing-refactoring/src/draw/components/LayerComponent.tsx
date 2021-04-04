import React, { useState, useEffect } from 'react';
import { Layer } from '../interfaces/index-interfaces';
import { LayerComponentProps } from '../interfaces/layer-interfaces';
import '../index.css';
import { mouseDown, mouseMove, mouseUp } from '../functions/draw';
import {
  createLayer,
  createLayerByCanvasId,
  deleteLayerByCanvasId,
} from '../functions/layer-functions';
import { joinRoom } from '../functions/connect';

function LayerComponent(props: LayerComponentProps) {
  useEffect(() => {
    if (props.roomData !== null && props.roomData.users !== undefined) {
      // console.log('------userId', props.data.userId);
      const length = props.roomData.users.length;
      console.log('------userName', props.roomData.users);
      const newLayers = props.roomData.users.map((user, index) => {
        return {
          name: user.userName,
          canvasId: user.userId,
          buttonId: `${user.userId}-button`,
          canvasCtx: null,
        };
      });

      props.setLayers(newLayers);
      props.setNewLayerCtxSignal(new Date().getTime());
      //   console.log(
      //     !props.layers.find((layer) => layer.canvasId === user.userId),
      //   );
      //   if (!props.layers.find((layer) => layer.canvasId === user.userId))
      //     createLayerByCanvasId(
      //       user.userId,
      //       props.activeLayer,
      //       props.layers,
      //       props.setActiveLayer,
      //       props.setCreateLayerSignal,
      //       props.setLayers,
      //     );
      // });
    }
  }, [props.roomData]);

  function onClickCreateLayer() {
    if (!props.socket) return;
    // const targetLayerId = createLayer(
    //   props.activeLayer,
    //   props.layers,
    //   props.setActiveLayer,
    //   props.setNewLayerCtxSignal,
    //   props.setLayers,
    // );
    //! broadcast :: createLayer
    console.log('broadcast :: createLayer');
    const message = {
      event: 'create-layer',
      // canvasId: targetLayerId,
    };
    props.socket.emit('create-layer', message);
    // broadcast(JSON.stringify(message), props.peerConnectionContext);
    //! broadcast :: deleteLayer
  }

  function onClickDeleteLayer() {
    if (!props.socket || !props.activeLayer) return;
    const targetLayerId = props.activeLayer.canvasId;
    deleteLayerByCanvasId(targetLayerId, props.layers, props.setActiveLayer);

    //! broadcast :: deleteLayer
    console.log('broadcast :: deleteLayer');
    const message = {
      event: 'delete-layer',
      canvasId: targetLayerId,
    };
    props.socket.emit('delete-layer', message);
    // broadcast(JSON.stringify(message), peerConnectionContext);
    //! broadcast :: deleteLayer

    selectActiveLayer(props.layers[0]);
  }

  function selectActiveLayer(layer: Layer) {
    // console.log(' select active layer');
    props.setActiveLayer(layer);
  }

  useEffect(() => {
    console.log('newLayerCtxSignal');
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
      console.log(tmpCanvasCtxTable);
    }
    props.setLayers(tmpLayers);
    props.setCanvasCtxTable(tmpCanvasCtxTable);
  }, [props.newLayerCtxSignal]);

  useEffect(() => {
    onClickCreateLayer();
  }, []);

  return (
    <>
      <div>
        <button className='button layer_space' onClick={onClickCreateLayer}>
          make layer
        </button>
        <button className='button' onClick={onClickDeleteLayer}>
          delete layer
        </button>
        <div id='layerButtonContainer'>
          {props.layers.map((layer) => {
            if (layer.canvasId !== props.data.userId)
              return (
                <span
                  key={layer.canvasId}
                  id={layer.buttonId}
                  className={`layer_space ${
                    props.activeLayer != null &&
                    props.activeLayer.name === layer.name
                      ? 'active-layer'
                      : ''
                  }`}
                  onClick={() => selectActiveLayer(layer)}
                >
                  {layer.name}
                </span>
              );
          })}
        </div>
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
                layer.canvasId === props.data.userId
                  ? 'layer-right'
                  : 'layer-left'
              } ${
                props.activeLayer !== null &&
                props.activeLayer.canvasId !== layer.canvasId
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
                  // props.drawHistory,
                  // props.setDrawHistory,
                )
              }
              onMouseUp={
                () => mouseUp()
                // (props.activeLayer as Layer).canvasCtx,
                // props.peerConnectionContext,
                // props.drawHistory,
                // props.setDrawHistory,
              }
            />
          );
        })}
      </div>
    </>
  );
}

export default LayerComponent;
