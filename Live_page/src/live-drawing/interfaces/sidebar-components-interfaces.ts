import { RoomInfo, UsersInfo } from './socket-interfaces';
import { Layer } from './draw-components-interfaces';

export interface SidebarComponentProps {
  topLayer: Layer | null;
  roomInfo: RoomInfo;
  layers: Layer[];
  isLiveClosed: boolean;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  setIsLiveClosed: React.Dispatch<React.SetStateAction<boolean>>;
  users: UsersInfo[];
  selectedId: string | null;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}
