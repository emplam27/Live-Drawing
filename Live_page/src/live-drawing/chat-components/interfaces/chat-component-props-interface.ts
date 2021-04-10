import { RoomInfo } from '../../interfaces/socket-interfaces';

export interface ChatComponentProps {
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
}
