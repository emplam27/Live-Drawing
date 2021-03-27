export interface EraseSizeComponentProps {
  eraserWidth: number;
  cursorWidth: number;
  setEraserWidth: React.Dispatch<React.SetStateAction<number>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
}
