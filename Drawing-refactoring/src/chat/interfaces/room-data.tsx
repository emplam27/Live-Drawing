import { UserInfo } from './user-info-interface';

export interface RoomData {
  room: string;
  users: UserInfo[];
  isHost: boolean;
}
