export interface LineSizeComponentProps {
  activeTool: string;
  cursorWidth: number;
  lineWidth: number;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
}
