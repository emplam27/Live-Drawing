import { DrawData } from './draw-interfaces';
import { CanvasCtxTable, PeerConnectionContext } from './index-interfaces';

export interface Layer {
  name: string;
  canvasId: string;
  buttonId: string;
  canvasCtx: CanvasRenderingContext2D | null;
}

export interface LayerComponentProps {
  activeTool: string;
  color: string;
  lineWidth: number;
  eraserWidth: number;
  layers: Layer[];
  layerCount: number;
  canvasCtxTable: { [key: string]: CanvasRenderingContext2D };
  activeLayer: Layer | null;
  drawHistory: DrawData[];
  peerConnectionContext: PeerConnectionContext;
  readyToDrawHistorySignal: number;
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setLayerCount: React.Dispatch<React.SetStateAction<number>>;
  setActiveLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  setCanvasCtxTable: React.Dispatch<React.SetStateAction<CanvasCtxTable>>;
  setDrawHistory: React.Dispatch<React.SetStateAction<DrawData[]>>;
  setReadyToDrawHistorySignal: React.Dispatch<React.SetStateAction<number>>;
  // setCanvasCtx: React.Dispatch<
  //   React.SetStateAction<CanvasRenderingContext2D | null>
  // >;
  // updateActiveLayer: any;
}
