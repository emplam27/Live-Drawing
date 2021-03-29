export interface LineSizeComponentProps {
  activeTool: string;
  canvas: any | null;
  cursorWidth: number;
  lineWidth: number;
  setCanvas: React.Dispatch<React.SetStateAction<any | null>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
}
