import React, { useEffect } from 'react';
import { mouseDown, mouseMove, mouseUp, key } from '../../../functions/draw';
import '../index.css';
import { Layer, LayerComponentProps } from '../interfaces/layer-interfaces';
// import { useActiveLayerState, useActiveLayerDispatch } from '../DrawContext';

function LayerComponent(props: LayerComponentProps) {
  // const [canvasCtx, setCanvasCtx] = useContext(CanvasCtxContext);
  // const canvasCtxDispatch = useCanvasCtxsDispatch();

  // const activeLayer = useActiveLayerState();
  // const setActiveLayer = useActiveLayerDispatch();

  function createLayer() {
    console.log('create layer');
    // console.log(activeLayer);

    const newLayer: Layer = {
      name: `layer-${props.layerCount}`,
      canvasId: `layer-id-${props.layerCount}`,
      buttonId: `layer-id-${props.layerCount}-button`,
      canvasCtx: null,
    };

    // 새로 만들어진 layer를 activeLayer로 바꾸기
    if (props.activeLayer === null) {
      // setActiveLayer({ type: 'SET_ACTIVE_LAYER', layer: newLayer });
      props.setActiveLayer(newLayer);
    }
    props.setLayers([...props.layers, newLayer]);
    props.setLayerCount(props.layerCount + 1);
    // resize();
  }

  function deleteLayer() {
    console.log('delete layer');
    // console.log(activeLayer);

    if (props.layers.length === 1) return;

    let index = 0;
    props.layers.forEach((layer, i) => {
      if (props.activeLayer != null && layer.name === props.activeLayer.name) {
        index = i;
      }
    });
    props.layers.splice(index, 1);
    props.setLayers(props.layers);

    if (index === props.layers.length && index >= 1) {
      index -= 1;
    }
    selectActiveLayer(props.layers[index]);
  }

  function selectActiveLayer(layer: Layer) {
    console.log('*************** select active layer ***************');
    // console.log(activeLayer);

    // setCanvasCtx(layer.canvasCtx);
    // updateActiveLayer(layer);
    // setActiveLayer({ type: 'SET_ACTIVE_LAYER', layer: layer });
    props.setActiveLayer(layer);
  }

  useEffect(() => {
    // 마지막에 추가되는 canvas에 대해서 layers에 ctx 저장하기
    if (props.layers.length !== 0) {
      // console.log(layers);
      const newLayer = props.layers[props.layers.length - 1];
      const newCanvas: HTMLElement | null = document.getElementById(
        newLayer.canvasId,
      );
      const newCanvasCtx = (newCanvas as HTMLCanvasElement).getContext('2d');
      newLayer.canvasCtx = newCanvasCtx;
      console.log('useEffect :: setActiveLayer');
      props.setActiveLayer(newLayer);
      // setActiveLayer({ type: 'SET_ACTIVE_LAYER', layer: newLayer });
      selectActiveLayer(newLayer);

      // const tmpCanvasCtxTable = { ...canvasCtxTable };
      // tmpCanvasCtxTable[newLayer.name] = newCanvasCtx;
      // setCanvasCtxTable(tmpCanvasCtxTable);
    }
  }, [props.layers]);

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
              height={window.innerHeight * 0.8}
              onMouseDown={(e) => mouseDown(e)}
              onMouseMove={(e) =>
                mouseMove(
                  e,
                  (props.activeLayer as Layer).canvasCtx,
                  props.activeTool,
                  props.color,
                  props.lineWidth,
                  props.eraserWidth,
                  props.peerConnectionContext,
                )
              }
              onMouseUp={() =>
                mouseUp(
                  (props.activeLayer as Layer).canvasCtx,
                  props.peerConnectionContext,
                )
              }
              onKeyDown={key}
            />
          );
        })}
      </div>
    </>
  );
}

export default LayerComponent;
