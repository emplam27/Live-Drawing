import { RoomInfo, RoomUsers } from '../../../interfaces/socket-interfaces';
import {
  CanvasCtxTable,
  Layer,
} from '../../../interfaces/draw-components-interfaces';

export interface HostCopyImageButtonComponentProps {
  canvasCtxTable: CanvasCtxTable;
  isModifiedMode: boolean;
  layers: Layer[];
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  socket: SocketIOClient.Socket | null;
  topLayer: Layer | null;
  setIsModifiedMode: React.Dispatch<React.SetStateAction<boolean>>;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  badgeStyle: string;
  buttonStyle: string;
  displayHidden: boolean;
}
