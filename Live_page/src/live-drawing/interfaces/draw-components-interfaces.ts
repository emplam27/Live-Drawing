import { RoomUsers, RoomInfo } from './socket-interfaces';

export interface DrawComponentProps {
  topLayer: Layer | null;
  isLiveClosed: boolean;
  layers: Layer[];
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  socket: SocketIOClient.Socket | null;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setIsLiveClosed: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface Point {
  x: number;
  y: number;
  c: string;
}

export interface DrawData {
  event: string;
  canvasId: string;
  currentPoint: Point;
  color: string;
  count: number;
  lastPoint: Point;
  lineWidth: number;
}

export interface EraseData {
  event: string;
  canvasId: string;
  currentPoint: Point;
  r: number;
}

export interface CanvasCtxTable {
  [key: string]: CanvasRenderingContext2D;
}

export interface Layer {
  name: string;
  canvasId: string;
  buttonId: string;
  canvasCtx: CanvasRenderingContext2D | null;
}

export interface Params {
  roomId: string;
}

export interface PeerConnectionContext {
  username: string;
  roomId: string;
  token: string | null;
  eventSource: EventSource | null;
  peers: { [key: string]: RTCPeerConnection };
  channels: { [key: string]: RTCDataChannel };
  is_new: boolean;
  is_host: boolean;
  roomHostId: string | null;
}
