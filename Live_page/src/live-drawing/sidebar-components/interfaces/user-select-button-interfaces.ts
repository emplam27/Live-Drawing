import { Layer } from '../../interfaces/draw-components-interfaces';
import { RoomInfo, RoomUsers } from '../../interfaces/socket-interfaces';

export interface UserSelectButtonComponentProps {
  isModifiedMode: boolean;
  layers: Layer[];
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  topLayer: Layer | null;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
