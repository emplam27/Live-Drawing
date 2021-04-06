import { Layer } from '../../interfaces/draw-components-interfaces';
import { RoomInfo, UserProfileInfo } from '../../interfaces/socket-interfaces';

export interface UserSelectButtonComponentProps {
  topLayer: Layer | null;
  userProfileInfos: UserProfileInfo[];
  roomInfo: RoomInfo;
  layers: Layer[];
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
