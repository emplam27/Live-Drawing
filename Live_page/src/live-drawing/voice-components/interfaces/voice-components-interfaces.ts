import { RoomInfo } from '../../interfaces/socket-interfaces';

export interface VoiceChatComponentProps {
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
}
export interface VoiceUIDTable {
  [key: number]: string;
}
