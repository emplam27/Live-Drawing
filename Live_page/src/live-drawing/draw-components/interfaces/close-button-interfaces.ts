import { RoomInfo } from '../../interfaces/socket-interfaces';

export interface CloseButtonComponentProps {
  roomInfo: RoomInfo;
  setIsLiveClosed: React.Dispatch<React.SetStateAction<boolean>>;
}
