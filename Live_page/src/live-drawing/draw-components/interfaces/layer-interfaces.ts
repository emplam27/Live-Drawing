import { RoomInfo, RoomUsers } from '../../interfaces/socket-interfaces';
import {
  Layer,
  CanvasCtxTable,
} from '../../interfaces/draw-components-interfaces';

export interface LayerComponentProps {
  activeLayer: Layer | null;
  canvasCtxTable: CanvasCtxTable;
  cursorWidth: number;
  layers: Layer[];
  newLayerCtxSignal: number | null;
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  socket: SocketIOClient.Socket | null;
  setActiveLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  setCanvasCtxTable: React.Dispatch<React.SetStateAction<CanvasCtxTable>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setLayers: React.Dispatch<React.SetStateAction<Layer[]>>;
  setNewLayerCtxSignal: React.Dispatch<React.SetStateAction<number | null>>;
}
