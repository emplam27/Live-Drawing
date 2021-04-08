import { RoomInfo } from '../../interfaces/socket-interfaces';
import { Layer } from '../../interfaces/draw-components-interfaces';

export interface HostLayerBadgeComponentProps {
  layers: Layer[];
  roomInfo: RoomInfo;
  topLayer: Layer | null;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  badgeStyle: string;
  buttonStyle: string;
}
