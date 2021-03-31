import { DrawData } from './draw-interfaces';
import { PeerConnectionContext } from './index-interfaces';

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

export interface CanvasComponentProps {
  activeTool: string;
  canvas: any | null;
  drawHistory: DrawData[];
  peerConnectionContext: PeerConnectionContext;
  setCanvas: React.Dispatch<React.SetStateAction<any | null>>;
  setDrawHistory: React.Dispatch<React.SetStateAction<DrawData[]>>;
}
