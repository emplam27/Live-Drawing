import { CanvasCtxTable } from '../../interfaces/draw-components-interfaces';
import { RoomInfo } from '../../interfaces/socket-interfaces';

export interface UndrawableCanvasComponentProps {
  canvasId: string;
  displayHidden: boolean;
  canvasCtxTable: CanvasCtxTable;
  socket: SocketIOClient.Socket | null;
  roomInfo: RoomInfo;
}
