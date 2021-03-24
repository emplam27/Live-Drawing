import React, { useEffect } from 'react';
import { mouseDown, mouseMove, mouseUp, key } from '../../../functions/draw';
import '../index.css';
// import { useCanvasCtxsDispatch } from '../DrawContext';

interface Layer {
  name: string;
  canvasId: string;
  buttonId: string;
  canvasCtx: CanvasRenderingContext2D | null;
}

interface LayerComponentProps {
  activeTool: string;
  color: string;
  lineWidth: number;
  eraserWidth: number;
  layers: Layer[];
  canvas: HTMLCanvasElement;
  layerCount: number;
  canvasCtxTable: { [key: string]: CanvasRenderingContext2D };
  canvasCtx: any;
  activeLayer: any;
  setLayers: any;
  setCanvas: any;
  setLayerCount: any;
  setActiveLayer: any;
  setCanvasCtx: any;
  peerConnectionContext: any;
  setCanvasCtxTable: any;
}

function LayerComponent({
  activeTool,
  color,
  lineWidth,
  eraserWidth,
  layers,
  canvas,
  canvasCtx,
  canvasCtxTable,
  layerCount,
  activeLayer,
  setLayers,
  setCanvas,
  setLayerCount,
  setActiveLayer,
  setCanvasCtx,
  setCanvasCtxTable,
  peerConnectionContext,
}: LayerComponentProps) {
  // const [canvasCtx, setCanvasCtx] = useContext(CanvasCtxContext);
  // const canvasCtxDispatch = useCanvasCtxsDispatch();

  async function createLayer() {
    console.log('create layer');
    console.log(activeLayer);

    const newLayer: Layer = {
      name: `layer-${layerCount}`,
      canvasId: `layer-id-${layerCount}`,
      buttonId: `layer-id-${layerCount}-button`,
      canvasCtx: null,
    };

    // 새로 만들어진 layer를 activeLayer로 바꾸기
    if (activeLayer === null) {
      setActiveLayer(newLayer);
    }
    setLayers([...layers, newLayer]);
    setLayerCount(layerCount + 1);
    // resize();
  }

  function deleteLayer() {
    console.log('delete layer');
    console.log(activeLayer);

    if (layers.length === 1) return;

    let index = 0;
    layers.forEach((layer, i) => {
      if (layer.name === activeLayer.name) {
        index = i;
      }
    });
    layers.splice(index, 1);
    setLayers(layers);

    if (index === layers.length && index >= 1) {
      index -= 1;
    }
    selectActiveLayer(layers[index]);
  }

  function selectActiveLayer(layer: Layer) {
    console.log('select active layer');
    console.log(activeLayer);

    // setCanvasCtx(layer.canvasCtx);
    setActiveLayer(layer);
  }

  useEffect(() => {
    // 마지막에 추가되는 canvas에 대해서 layers에 ctx 저장하기
    if (layers.length !== 0) {
      // console.log(layers);
      const newLayer = layers[layers.length - 1];
      const newCanvas: any = document.getElementById(newLayer.canvasId);
      const newCanvasCtx = newCanvas.getContext('2d');
      newLayer.canvasCtx = newCanvasCtx;
      selectActiveLayer(newLayer);

      const tmpCanvasCtxTable = { ...canvasCtxTable };
      tmpCanvasCtxTable[newLayer.name] = newCanvasCtx;
      setCanvasCtxTable(tmpCanvasCtxTable);
    }
  }, [layers]);

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
          {layers.map((layer) => {
            return (
              <span
                key={layer.name}
                id={layer.buttonId}
                className={`layer_space ${
                  activeLayer.name === layer.name ? 'active-layer' : ''
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
        {layers.map((layer) => {
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
                  activeLayer.canvasCtx,
                  activeTool,
                  color,
                  lineWidth,
                  eraserWidth,
                  peerConnectionContext,
                )
              }
              onMouseUp={() =>
                mouseUp(activeLayer.canvasCtx, peerConnectionContext)
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
