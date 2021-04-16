import { RoomInfo } from '../../interfaces/socket-interfaces';
import { CanvasCtxTable } from '../../interfaces/draw-components-interfaces';

export interface MyLayerComponentProps {
  activeTool: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  eraserWidth: number;
  isModifiedMode: boolean;
  lineWidth: number;
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setPosition: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
  badgeContainerStyle: string;
  badgeStyle: string;
  displayHidden: boolean;
}
