import { RoomInfo } from '../../../interfaces/socket-interfaces';

export interface LectureStartComponentProps {
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
  setIsLectureStarted: React.Dispatch<React.SetStateAction<boolean>>;
}
