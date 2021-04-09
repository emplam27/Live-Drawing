import {
  RoomInfo,
  RoomUsers,
  UserInfo,
} from '../../../interfaces/socket-interfaces';
import {
  Layer,
  CanvasCtxTable,
} from '../../../interfaces/draw-components-interfaces';

export interface PeersLayerComponentProps {
  activeTool: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  eraserWidth: number;
  layers: Layer[];
  lineWidth: number;
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  socket: SocketIOClient.Socket | null;
  topLayer: Layer | null;
  setIsModifiedMode: React.Dispatch<React.SetStateAction<boolean>>;
  setModifiedTargetUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
