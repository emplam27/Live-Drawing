import { RoomInfo } from '../../../interfaces/socket-interfaces';
import { CanvasCtxTable } from '../../../interfaces/draw-components-interfaces';

export interface MyLayerComponentProps {
  activeTool: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  eraserWidth: number;
  lineWidth: number;
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
}
