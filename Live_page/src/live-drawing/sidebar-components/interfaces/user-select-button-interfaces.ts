import { RoomInfo } from '../../interfaces/socket-interfaces';
import { Layer } from '../../interfaces/draw-components-interfaces';

export interface UserSelectButtonComponentProps {
  topLayer: Layer | null;
  roomInfo: RoomInfo;
  layers: Layer[];
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
