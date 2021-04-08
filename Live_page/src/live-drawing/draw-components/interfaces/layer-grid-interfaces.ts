import { RoomInfo, UserInfo } from '../../interfaces/socket-interfaces';
import {
  Layer,
  CanvasCtxTable,
} from '../../interfaces/draw-components-interfaces';

export interface LayerGridComponentProps {
  canvasCtxTable: CanvasCtxTable;
  cursorWidth: number;
  layers: Layer[];
  modifiedLayers: Layer[];
  modifiedTargetUser: UserInfo | null;
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
  topLayer: Layer | null;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setModifiedTargetUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  setModifiedLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
