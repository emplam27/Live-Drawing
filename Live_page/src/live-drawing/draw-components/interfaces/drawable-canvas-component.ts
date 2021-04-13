import { RoomInfo } from '../../interfaces/socket-interfaces';
import { CanvasCtxTable } from '../../interfaces/draw-components-interfaces';

export interface DrawableCanvasComponentProps {
  activeTool: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  eraserWidth: number;
  lineWidth: number;
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
  canvasId: string;
  displayHidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setPosition: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
}
