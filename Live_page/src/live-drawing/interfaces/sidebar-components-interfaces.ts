import { RoomInfo, UserProfileInfo } from './socket-interfaces';
import { Layer } from './draw-components-interfaces';

export interface SidebarComponentProps {
  isLiveClosed: boolean;
  layers: Layer[];
  roomInfo: RoomInfo;
  topLayer: Layer | null;
  socket: SocketIOClient.Socket | null;
  userProfileInfos: UserProfileInfo[];
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
