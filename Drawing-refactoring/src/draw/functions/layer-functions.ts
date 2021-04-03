import { v4 as uuid } from 'uuid';
import { Layer } from '../interfaces/index-interfaces';

export function createLayer(
  activeLayer: any,
  layers: any,
  setActiveLayer: any,
  setCreateLayerSignal: any,
  setLayers: any,
) {
  // console.log('create layer');
  const layerId: string = uuid();
  const newLayer: Layer = {
    name: layerId,
    canvasId: layerId,
    buttonId: `${layerId}-button`,
    canvasCtx: null,
  };

  // 새로 만들어진 layer를 activeLayer로 바꾸기
  if (activeLayer === null) {
    setActiveLayer(newLayer);
  }
  setLayers([...layers, newLayer]);
  // setLayerCount(layerCount + 1);
  setCreateLayerSignal(new Date().getTime());

  return newLayer.canvasId;
}

export function createLayerByCanvasId(
  canvasId: any,
  activeLayer: any,
  layers: any,
  setActiveLayer: any,
  setCreateLayerSignal: any,
  setLayers: any,
) {
  const layerId: string = canvasId;
  const newLayer: Layer = {
    name: layerId,
    canvasId: layerId,
    buttonId: `${layerId}-button`,
    canvasCtx: null,
  };

  // 새로 만들어진 layer를 activeLayer로 바꾸기
  if (activeLayer === null) {
    setActiveLayer(newLayer);
  }
  setLayers([...layers, newLayer]);
  // setLayerCount(layerCount + 1);
  setCreateLayerSignal(new Date().getTime());
}

export function deleteLayerByCanvasId(
  targetLayerId: any,
  layers: any,
  setLayers: any,
) {
  // console.log('delete layer');
  if (layers.length === 1) return;

  let index = 0;
  let targetLayer: any;
  layers.forEach((layer: any, i: number) => {
    if (layer.canvasId === targetLayerId) {
      targetLayer = layers[i];
      index = i;
    }
  });
  if (!targetLayer) return;
  layers.splice(index, 1);
  setLayers(layers);
}
