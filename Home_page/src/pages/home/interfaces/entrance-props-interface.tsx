export interface EntranceProps {
  roomId: string;
  roomTitle: string;
  roomPk: number;
  // roomHost: string;
}

export interface ResponseEntranceProps {
  data: EntranceProps[];
}

export interface Values {
  roomPk: number;
  roomId: string;
  password: string;
  userId: string | null;
}
