import { RoomInfo, UsersInfo } from '../../interfaces/socket-interfaces';

export interface UsersComponentProps {
  users: UsersInfo[];
  roomInfo: RoomInfo;
  setSelectedId: React.Dispatch<React.SetStateAction<string | null>>;
}
