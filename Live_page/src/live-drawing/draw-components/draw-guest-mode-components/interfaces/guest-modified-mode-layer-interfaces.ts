import { RoomInfo } from '../../../interfaces/socket-interfaces';
import {
  CanvasCtxTable,
  Layer,
} from '../../../interfaces/draw-components-interfaces';

export interface GuestModifiedModeLayerComponentProps {
  activeTool: string;
  canvasCtxTable: CanvasCtxTable;
  color: string;
  copyModifiedCanvasSignal: number | null;
  eraserWidth: number;
  isModifiedMode: boolean;
  lineWidth: number;
  modifiedLayers: Layer[];
  roomInfo: RoomInfo;
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
