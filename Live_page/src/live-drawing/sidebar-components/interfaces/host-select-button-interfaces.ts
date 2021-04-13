import { Layer } from '../../interfaces/draw-components-interfaces';
import { RoomInfo, RoomUsers } from '../../interfaces/socket-interfaces';

export interface HostSelectButtonComponentProps {
  isModifiedMode: boolean;
  layers: Layer[];
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  speakingUsers: number[] | null;
  topLayer: Layer | null;
  setSpeakingUsers: React.Dispatch<React.SetStateAction<number[] | null>>;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
}
