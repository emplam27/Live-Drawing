import { RoomInfo, RoomUsers } from '../../interfaces/socket-interfaces';
import {
  Layer,
  CanvasCtxTable,
} from '../../interfaces/draw-components-interfaces';

export interface HostModeComponentProps {
  activeTool: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  cursorWidth: number;
  eraserWidth: number;
  isLectureStarted: boolean;
  isModifiedMode: boolean;
  layers: Layer[];
  lineWidth: number;
  modifiedLayers: Layer[];
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  socket: SocketIOClient.Socket | null;
  topLayer: Layer | null;
  setActiveTool: React.Dispatch<React.SetStateAction<string>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setEraserWidth: React.Dispatch<React.SetStateAction<number>>;
  setIsLectureStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModifiedMode: React.Dispatch<React.SetStateAction<boolean>>;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
  setModifiedLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  layerContainerGridStyle: string;
}
