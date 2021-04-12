import { RoomInfo } from '../../interfaces/socket-interfaces';

export interface CloseButtonComponentProps {
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
}
