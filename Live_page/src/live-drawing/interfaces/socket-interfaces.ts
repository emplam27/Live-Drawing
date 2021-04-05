export interface RoomInfo {
  roomTitle: string;
  roomId: string;
  userName: string;
  userId: string;
  hostId: string;
}

export interface ResponseData {
  roomInfo: RoomInfo;
}

export interface UserInfo {
  userName: string;
  socketId: SocketIOClient.Socket | null;
  userId: string;
  roomdId: string;
}

export interface RoomUsers {
  roomId: string;
  users: UserInfo[];
}
