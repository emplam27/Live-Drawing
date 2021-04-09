import {
  RoomInfo,
  RoomUsers,
  UserInfo,
} from '../../../interfaces/socket-interfaces';
import { Layer } from '../../../interfaces/draw-components-interfaces';

export interface HostLayerBadgeComponentProps {
  layers: Layer[];
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  topLayer: Layer | null;
  setIsModifiedMode: React.Dispatch<React.SetStateAction<boolean>>;
  setModifiedTargetUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  badgeStyle: string;
  buttonStyle: string;
}
