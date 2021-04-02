import React, { useState, useEffect } from 'react';
import { Layer } from '../interfaces/index-interfaces';
import { LayerComponentProps } from '../interfaces/layer-interfaces';
import '../index.css';
import { broadcast, mouseDown, mouseMove, mouseUp } from '../functions/draw';
import { v4 as uuid } from 'uuid';

function LayerComponent(props: LayerComponentProps) {
  const [createLayerSignal, setCreateLayerSignal] = useState<number | null>(
    null,
  );

  function createLayer() {
    if (props.layers.length > 50) {
      console.log('layer가 50개가 넘어서 못 만들어.');
      return;
    }

    // console.log('create layer');
    const layerId: string = uuid();
    const newLayer: Layer = {
      name: `layer-${layerId}`,
      canvasId: `layer-id-${layerId}`,
      buttonId: `layer-id-${layerId}-button`,
      canvasCtx: null,
    };

    // 새로 만들어진 layer를 activeLayer로 바꾸기
    if (props.activeLayer === null) {
      props.setActiveLayer(newLayer);
    }
    props.setLayers([...props.layers, newLayer]);
    // props.setLayerCount(props.layerCount + 1);
    setCreateLayerSignal(new Date().getTime());

    //! broadcast :: createLayer
    console.log('broadcast :: createLayer');
    const message = {
      event: 'create-layer',
      canvasId: layerId,
    };
    broadcast(JSON.stringify(message), props.peerConnectionContext);
    //! broadcast :: deleteLayer
  }

  function deleteLayer() {
    // console.log('delete layer');
    if (props.layers.length === 1) return;

    let index = 0;
    props.layers.forEach((layer, i) => {
      if (props.activeLayer != null && layer.name === props.activeLayer.name)
        index = i;
    });

    //! broadcast :: deleteLayer
    console.log('broadcast :: createLayer');
    const message = {
      event: 'delete-layer',
      canvasId: props.layers[index].canvasId,
    };
    broadcast(JSON.stringify(message), props.peerConnectionContext);
    //! broadcast :: deleteLayer

    props.layers.splice(index, 1);
    props.setLayers(props.layers);

    if (index === props.layers.length && index >= 1) index -= 1;
    selectActiveLayer(props.layers[index]);
  }

  function selectActiveLayer(layer: Layer) {
    // console.log(' select active layer');
    props.setActiveLayer(layer);
  }

  useEffect(() => {
    // console.log(props.layers);
    // 마지막에 추가되는 canvas에 대해서 layers에 ctx 저장하기
    const layersLength: number = props.layers.length;
    if (layersLength === 0 || createLayerSignal === null) return;

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
  }, [createLayerSignal]);

  useEffect(() => {
    createLayer();
  }, []);
  return (
    <>
      <div>
        <button className='button layer_space' onClick={createLayer}>
          make layer
        </button>
        <button className='button' onClick={deleteLayer}>
          delete layer
        </button>
        <div id='layerButtonContainer'>
          {props.layers.map((layer) => {
            return (
              <span
                key={layer.name}
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
      <div id='canvasContainer' className='spacer app relative'>
        {props.layers.map((layer) => {
          return (
            <canvas
              key={layer.name}
              id={layer.canvasId}
              className={'layer'}
              width={window.innerWidth * 0.8}
              height={window.innerHeight - 110}
              onMouseDown={(e) => mouseDown(e)}
              onMouseMove={(e) =>
                mouseMove(
                  e,
                  props.activeLayer,
                  props.activeTool,
                  props.color,
                  props.lineWidth,
                  props.eraserWidth,
                  props.peerConnectionContext,
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
