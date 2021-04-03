import { RoomData } from '../../chat/interfaces/room-data';

export interface DrawProps {
  socket: SocketIOClient.Socket | null;
  roomKey: string;
  // roomData: RoomData;
}
