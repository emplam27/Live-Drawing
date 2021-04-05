import { RoomInfo } from '../../interfaces/socket-interfaces';
import { Layer } from '../../interfaces/draw-components-interfaces';

export interface UserSelectButtonComponentProps {
  activeLayer: Layer | null;
  roomInfo: RoomInfo;
  layers: Layer[];
  setActiveLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
