import { RoomInfo } from '../../../interfaces/socket-interfaces';
import { Layer } from '../../../interfaces/draw-components-interfaces';

export interface GuestLectureModeBadgeComponentProps {
  layers: Layer[];
  roomInfo: RoomInfo;
  topLayer: Layer | null;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  badgeContainerStyle: string;
  badgeStyle: string;
  buttonStyle: string;
  displayHidden: boolean;
}
