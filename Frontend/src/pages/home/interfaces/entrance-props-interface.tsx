export interface EntranceProps {
  roomKey: string;
  roomTitle: string;
  roomPk: number;
}

export interface ResponseEntranceProps {
  data: EntranceProps[];
}
