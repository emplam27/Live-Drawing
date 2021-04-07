export interface RoomInfo {
  roomTitle: string | null;
  roomId: string | null;
  username: string | null;
  userId: string | null;
  roomHostId: string | null;
}

export interface UserProfileInfo {
  username: string | null;
  userId: string;
  userImage: string;
}

export interface ResponseData {
  roomInfo: RoomInfo;
}

export interface UserInfo {
  username: string;
  socketId: SocketIOClient.Socket | null;
  userId: string;
  roomId: string;
}

export interface RoomUsers {
  roomId: string;
  users: UserInfo[];
}
