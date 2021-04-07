import { RoomInfo, UserProfileInfo } from './socket-interfaces';
import { Layer } from './draw-components-interfaces';

export interface SidebarComponentProps {
  isLiveClosed: boolean;
  layers: Layer[];
  roomInfo: RoomInfo;
  topLayer: Layer | null;
  userProfileInfos: UserProfileInfo[];
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  // setIsLiveClosed: React.Dispatch<React.SetStateAction<boolean>>;
  socket: SocketIOClient.Socket | null;
}
