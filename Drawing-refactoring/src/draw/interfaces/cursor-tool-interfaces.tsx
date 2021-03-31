export interface CursorToolComponentProps {
  activeTool: string;
  canvas: any | null;
  setActiveTool: React.Dispatch<React.SetStateAction<string>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
}
export interface Tool {
  name: string;
  iconClass: string;
}
