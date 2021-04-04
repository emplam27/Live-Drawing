export interface UserInfo {
  userName: string;
  socketId: SocketIOClient.Socket | null;
  userId: string;
  roomdId: string;
}

export interface ResponseUserInfo {
  data: UserInfo;
}
