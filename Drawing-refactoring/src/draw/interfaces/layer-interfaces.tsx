import { DrawData } from '../functions/draw-interfaces';
import { PeerConnectionContext, CanvasCtxTable } from './index-interfaces';

export interface Layer {
  name: string;
  canvasId: string;
  buttonId: string;
  canvasCtx: any | null;
}

export interface Message {
  event: string | null;
  tool: string | null;
  object: any;
}

export interface LayerComponentProps {
  activeTool: string;
  activeLayer: Layer | null;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  drawHistory: DrawData[];
  eraserWidth: number;
  layerCount: number;
  layers: Layer[];
  lineWidth: number;
  newLayerCtxSignal: number | null;
  peerConnectionContext: PeerConnectionContext;
  socket: SocketIOClient.Socket | null;
  setActiveLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  setCanvasCtxTable: React.Dispatch<React.SetStateAction<CanvasCtxTable>>;
  setDrawHistory: React.Dispatch<React.SetStateAction<DrawData[]>>;
  setLayerCount: React.Dispatch<React.SetStateAction<number>>;
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setNewLayerCtxSignal: React.Dispatch<React.SetStateAction<number | null>>;
}
