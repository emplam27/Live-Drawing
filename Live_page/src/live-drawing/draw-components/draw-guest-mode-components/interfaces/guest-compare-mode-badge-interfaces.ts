import { RoomInfo } from '../../../interfaces/socket-interfaces';

export interface GuestCompareModeBadgeComponentProps {
  isCompareMode: boolean;
  roomInfo: RoomInfo;
  setIsCompareMode: React.Dispatch<React.SetStateAction<boolean>>;
  badgeContainerStyle: string;
  badgeStyle: string;
  buttonStyle: string;
  displayHidden: boolean;
}
