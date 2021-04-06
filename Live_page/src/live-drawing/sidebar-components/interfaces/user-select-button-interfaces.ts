import { Layer } from '../../interfaces/draw-components-interfaces';
import { RoomInfo, UsersInfo } from '../../interfaces/socket-interfaces';

export interface UserSelectButtonComponentProps {
  topLayer: Layer | null;
  users: UsersInfo[];
  roomInfo: RoomInfo;
  layers: Layer[];
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
