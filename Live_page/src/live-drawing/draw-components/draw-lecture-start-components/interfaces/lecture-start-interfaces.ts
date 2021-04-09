import { RoomInfo } from '../../../interfaces/socket-interfaces';

export interface LectureStartComponentProps {
  roomInfo: RoomInfo;
  setIsLectureStarted: React.Dispatch<React.SetStateAction<boolean>>;
}
