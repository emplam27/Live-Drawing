import { RoomInfo, RoomUsers } from '../../interfaces/socket-interfaces';
import {
  Layer,
  CanvasCtxTable,
} from '../../interfaces/draw-components-interfaces';

export interface GuestModeComponentProps {
  activeTool: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  copyModifiedCanvasSignal: number | null;
  cursorWidth: number;
  eraserWidth: number;
  isCompareMode: boolean;
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
  setCopyModifiedCanvasSignal: React.Dispatch<
    React.SetStateAction<number | null>
  >;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setEraserWidth: React.Dispatch<React.SetStateAction<number>>;
  setIsCompareMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLectureStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModifiedMode: React.Dispatch<React.SetStateAction<boolean>>;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
  setModifiedLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  layerContainerGridStyle: string;
}
