import { RoomData } from '../../chat/interfaces/room-data';
import { Data } from '../../interfaces/app-interfaces';

export interface DrawProps {
  socket: SocketIOClient.Socket | null;
  data: Data;
  roomData: RoomData | null;
}
