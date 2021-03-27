export interface ToolSelectComponentProps {
  activeTool: string;
  lineWidth: number;
  eraserWidth: number;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setActiveTool: React.Dispatch<React.SetStateAction<string>>;
}
export interface Tool {
  name: string;
  iconClass: string;
}
