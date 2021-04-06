import { RoomInfo, UserProfileInfo } from './socket-interfaces';
import { Layer } from './draw-components-interfaces';

export interface SidebarComponentProps {
  topLayer: Layer | null;
  roomInfo: RoomInfo;
  layers: Layer[];
  isLiveClosed: boolean;
  userProfileInfos: UserProfileInfo[];
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  setIsLiveClosed: React.Dispatch<React.SetStateAction<boolean>>;
}
