import { RoomInfo, RoomUsers } from '../../interfaces/socket-interfaces';
import {
  Layer,
  CanvasCtxTable,
} from '../../interfaces/draw-components-interfaces';

export interface PeersLayerComponentProps {
  activeTool: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  eraserWidth: number;
  layers: Layer[];
  lineWidth: number;
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
  topLayer: Layer | null;
}
