import { RoomInfo } from '../../../interfaces/socket-interfaces';
import { CanvasCtxTable } from '../../../interfaces/draw-components-interfaces';

export interface GuestCompareModeLayerComponentProps {
  canvasCtxTable: CanvasCtxTable;
  roomInfo: RoomInfo;
  displayHidden: boolean;
  socket: SocketIOClient.Socket | null;
}
