import { RoomInfo } from '../../interfaces/socket-interfaces';

export interface ChatComponentProps {
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
}

export interface ChatScreenComponentProps {
  screen: MessageForm[];
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
}

export interface ChatInputComponentProps {
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
}

export interface MessageForm {
  user: string | null;
  text: string;
}
