import {
  CursorPosition,
  Point,
} from '../../../interfaces/draw-components-interfaces';
import { RoomInfo } from '../../../interfaces/socket-interfaces';

export interface HostCursorComponentProps {
  position: CursorPosition | null;
  roomInfo: RoomInfo;
}
