export interface EntranceProps {
  roomId: string;
  roomTitle: string;
  roomHostname: string;
  setRooms: React.Dispatch<React.SetStateAction<EntranceProps[]>>;
}

export interface ResponseEntranceProps {
  data: EntranceProps[];
}

export interface Values {
  roomId: string;
  password: string;
  userId: string | null;
}
