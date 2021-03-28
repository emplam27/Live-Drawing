import { DrawData } from './draw-interfaces';
import { CanvasCtxTable, PeerConnectionContext } from './index-interfaces';

export interface Layer {
  name: string;
  canvasId: string;
  buttonId: string;
  canvasCtx: any | null;
}

export interface LayerComponentProps {
  canvas: any | null;
  drawHistory: DrawData[];
  peerConnectionContext: PeerConnectionContext;
  setCanvas: React.Dispatch<React.SetStateAction<any | null>>;
  setDrawHistory: React.Dispatch<React.SetStateAction<DrawData[]>>;
}
