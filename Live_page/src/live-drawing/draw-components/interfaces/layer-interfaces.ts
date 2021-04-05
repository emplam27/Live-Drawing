import { RoomInfo, RoomUsers } from '../../interfaces/socket-interfaces';
import { CanvasCtxTable } from '../../interfaces/draw-components-interfaces';

export interface Layer {
  name: string;
  canvasId: string;
  buttonId: string;
  canvasCtx: CanvasRenderingContext2D | null;
}

export interface Message {
  event: string | null;
  tool: string | null;
  object: any;
}

export interface LayerComponentProps {
  activeTool: string;
  topLayer: Layer | null;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  roomInfo: RoomInfo;
  eraserWidth: number;
  layers: Layer[];
  lineWidth: number;
  newLayerCtxSignal: number | null;
  roomUsers: RoomUsers | null;
  socket: SocketIOClient.Socket | null;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  setCanvasCtxTable: React.Dispatch<React.SetStateAction<CanvasCtxTable>>;
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setNewLayerCtxSignal: React.Dispatch<React.SetStateAction<number | null>>;
}
