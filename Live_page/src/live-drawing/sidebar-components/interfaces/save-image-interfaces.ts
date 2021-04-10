import { Layer } from '../../interfaces/draw-components-interfaces';
import { RoomInfo } from '../../interfaces/socket-interfaces';

export interface SaveImageComponentProps {
  layers: Layer[];
  roomInfo: RoomInfo;
}
