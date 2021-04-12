import { RoomUsers, RoomInfo } from './socket-interfaces';

export interface DrawComponentProps {
  copyModifiedCanvasSignal: number | null;
  isCompareMode: boolean;
  isLectureStarted: boolean;
  isModifiedMode: boolean;
  layers: Layer[];
  modifiedLayers: Layer[];
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  socket: SocketIOClient.Socket | null;
  topLayer: Layer | null;
  setCopyModifiedCanvasSignal: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  setIsCompareMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLectureStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModifiedMode: React.Dispatch<React.SetStateAction<boolean>>;
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setModifiedLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
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
  lastPoint: Point;
  lineWidth: number;
}

export interface StartData {
  point: Point;
  canvasId: string;
}

export interface EraseData {
  event: string;
  canvasId: string;
  currentPoint: Point;
  r: number;
}

export interface EndData {
  canvasId: string;
  point: Point;
  isMoved: boolean;
}

export interface CanvasCtxTable {
  [key: string]: CanvasRenderingContext2D;
}

export interface Layer {
  username: string;
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
