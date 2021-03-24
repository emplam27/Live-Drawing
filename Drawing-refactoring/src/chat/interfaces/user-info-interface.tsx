export interface UserInfo {
  userId: string;
  userCount?: number;
  id?: string;
}

export interface ResponseUserInfo {
  data: UserInfo;
}
