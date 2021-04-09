import { RoomInfo } from '../../interfaces/socket-interfaces';
import { CanvasCtxTable } from '../../interfaces/draw-components-interfaces';

export interface DrawableCanvasComponentProps {
  canvasId: string;
  activeTool: string;
  drawableCanvasclassName: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  eraserWidth: number;
  lineWidth: number;
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
}
