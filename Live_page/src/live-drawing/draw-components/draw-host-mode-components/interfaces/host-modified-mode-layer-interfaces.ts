import { RoomInfo, RoomUsers } from '../../../interfaces/socket-interfaces';
import {
  CanvasCtxTable,
  Layer,
} from '../../../interfaces/draw-components-interfaces';

export interface HostModifiedModeLayerComponentProps {
  activeTool: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  eraserWidth: number;
  isModifiedMode: boolean;
  lineWidth: number;
  modifiedLayers: Layer[];
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  topLayer: Layer | null;
  socket: SocketIOClient.Socket | null;
  displayHidden: boolean;
  setHidden: React.Dispatch<React.SetStateAction<boolean>>;
  setPosition: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >;
}
