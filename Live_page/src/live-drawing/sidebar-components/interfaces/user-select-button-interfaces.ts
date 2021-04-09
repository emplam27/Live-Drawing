import { Layer } from '../../interfaces/draw-components-interfaces';
import { RoomInfo, UserProfileInfo } from '../../interfaces/socket-interfaces';

export interface UserSelectButtonComponentProps {
  isModifiedMode: boolean;
  layers: Layer[];
  roomInfo: RoomInfo;
  topLayer: Layer | null;
  userProfileInfos: UserProfileInfo[];
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
