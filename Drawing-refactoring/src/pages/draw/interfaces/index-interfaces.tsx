export interface Params {
  roomKey: string;
}

export interface Layer {
  name: string;
  canvasId: string;
  buttonId: string;
  canvasCtx: CanvasRenderingContext2D | null;
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

export interface CanvasCtxTable {
  [key: string]: CanvasRenderingContext2D;
}
// interface point {
//   x: number;
//   y: number;
// }
