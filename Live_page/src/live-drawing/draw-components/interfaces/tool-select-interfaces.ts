export interface ToolSelectComponentProps {
  activeTool: string;
  color: string;
  eraserWidth: number;
  lineWidth: number;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setActiveTool: React.Dispatch<React.SetStateAction<string>>;
}
export interface Tool {
  name: string;
  iconClass: string;
}
