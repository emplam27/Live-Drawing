export interface RoomInfo {
  roomTitle: string | null;
  roomId: string | null;
  userName: string | null;
  userId: string | null;
  roomHostId: string | null;
}

export interface UsersInfo {
  userName: string | null;
  userId: string;
  userImage: string;
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
