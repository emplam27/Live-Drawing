import { RoomInfo, UserInfo } from '../../interfaces/socket-interfaces';
import {
  Layer,
  CanvasCtxTable,
} from '../../interfaces/draw-components-interfaces';

export interface LayerGridComponentProps {
  activeTool: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  cursorWidth: number;
  eraserWidth: number;
  isModifiedMode: boolean;
  layers: Layer[];
  lineWidth: number;
  modifiedLayers: Layer[];
  modifiedTargetUser: UserInfo | null;
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
  topLayer: Layer | null;
  setActiveTool: React.Dispatch<React.SetStateAction<string>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setEraserWidth: React.Dispatch<React.SetStateAction<number>>;
  setIsModifiedMode: React.Dispatch<React.SetStateAction<boolean>>;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
  setModifiedTargetUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  setModifiedLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
