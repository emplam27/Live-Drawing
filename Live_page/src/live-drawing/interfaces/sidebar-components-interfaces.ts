import { RoomInfo, RoomUsers } from './socket-interfaces';
import { Layer } from './draw-components-interfaces';

export interface SidebarComponentProps {
  isModifiedMode: boolean;
  layers: Layer[];
  roomInfo: RoomInfo;
  roomUsers: RoomUsers | null;
  socket: SocketIOClient.Socket | null;
  topLayer: Layer | null;
  setTopLayer: React.Dispatch<React.SetStateAction<Layer | null>>;
  setIsLectureStarted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModifiedMode: React.Dispatch<React.SetStateAction<boolean>>;
}
