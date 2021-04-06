import { RoomInfo } from './socket-interfaces';
import { Layer } from './draw-components-interfaces';

export interface SidebarComponentProps {
  topLayer: Layer | null;
  roomInfo: RoomInfo;
  layers: Layer[];
  isHost: boolean | null;
  isLiveClosed: boolean;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  setIsHost: React.Dispatch<React.SetStateAction<boolean | null>>;
  setIsLiveClosed: React.Dispatch<React.SetStateAction<boolean>>;
}
