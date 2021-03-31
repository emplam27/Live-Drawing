export interface EntranceProps {
  roomKey: string;
  roomTitle: string;
  roomPk: number;
  // roomHost: string;
}

export interface ResponseEntranceProps {
  data: EntranceProps[];
}

export interface Values {
  roomPk: number;
  roomKey: string;
  password: string;
  username: string | null;
}
