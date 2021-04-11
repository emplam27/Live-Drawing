import { RoomInfo, RoomUsers } from '../../interfaces/socket-interfaces';

export interface VoiceChatComponentProps {
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
  roomUsers: RoomUsers | null;
}
export interface VoiceUIDTable {
  [key: number]: string;
}
