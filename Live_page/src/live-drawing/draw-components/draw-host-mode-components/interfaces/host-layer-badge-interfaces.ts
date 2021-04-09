import { RoomInfo, RoomUsers } from '../../../interfaces/socket-interfaces';
import { Layer } from '../../../interfaces/draw-components-interfaces';

export interface HostLayerBadgeComponentProps {
  isModifiedMode: boolean;
  layers: Layer[];
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  topLayer: Layer | null;
  setIsModifiedMode: React.Dispatch<React.SetStateAction<boolean>>;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  badgeStyle: string;
  buttonStyle: string;
}
