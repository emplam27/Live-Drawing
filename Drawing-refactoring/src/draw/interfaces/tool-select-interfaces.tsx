export interface ToolSelectComponentProps {
  activeTool: string;
  canvas: any | null;
  color: string;
  eraserWidth: number;
  lineWidth: number;
  setCanvas: React.Dispatch<React.SetStateAction<any>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setActiveTool: React.Dispatch<React.SetStateAction<string>>;
}
export interface Tool {
  name: string;
  iconClass: string;
}
