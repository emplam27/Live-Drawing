export interface EraseSizeComponentProps {
  activeTool: string;
  cursorWidth: number;
  eraserWidth: number;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setEraserWidth: React.Dispatch<React.SetStateAction<number>>;
}
