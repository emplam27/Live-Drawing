export interface LineSizeComponentProps {
  lineWidth: number;
  cursorWidth: number;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
}
