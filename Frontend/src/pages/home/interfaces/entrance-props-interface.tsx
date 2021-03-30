export interface EntranceProps {
  roomKey: string;
  roomTitle: string;
  roomPk: number;
  // roomHost: string;
}

export interface ResponseEntranceProps {
  data: EntranceProps[];
}
