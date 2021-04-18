import { Layer } from '../../interfaces/draw-components-interfaces';
import { RoomInfo } from '../../interfaces/socket-interfaces';

export interface ClearCanvasComponentProps {
  layers: Layer[];
  roomInfo: RoomInfo;
}
