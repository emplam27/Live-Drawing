import { RoomUsers, RoomInfo } from './socket-interfaces';

export interface DrawProps {
  socket: SocketIOClient.Socket | null;
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
}

export interface Point {
  x: number;
  y: number;
  c: string;
}

export interface DrawData {
  event: string;
  canvasId: string;
  lastPoint: Point;
  currentPoint: Point;
  color: string;
  lineWidth: number;
}

export interface EraseData {
  event: string;
  canvasId: string;
  currentPoint: Point;
  r: number;
}

export interface RectData {
  color: string;
  origin: Point;
  width: number;
  height: number;
  commit?: boolean;
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
  hostId: string | null;
}
