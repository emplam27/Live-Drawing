import { EntranceProps } from './entrance-props-interface';

export interface roomInfo extends EntranceProps {
  members: {
    memberPk: number;
    memberName: string;
    // room_pk: number;
  };
}

export interface ResponseRoomInfo {
  data: roomInfo[];
}
