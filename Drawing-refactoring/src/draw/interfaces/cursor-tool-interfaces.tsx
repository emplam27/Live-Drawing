export interface CursorToolComponentProps {
  activeTool: string;
  setActiveTool: React.Dispatch<React.SetStateAction<string>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
}
export interface Tool {
  name: string;
  iconClass: string;
}
