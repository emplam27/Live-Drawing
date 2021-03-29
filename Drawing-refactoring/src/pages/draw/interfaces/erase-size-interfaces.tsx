export interface EraseSizeComponentProps {
  activeTool: string;
  canvas: any | null;
  cursorWidth: number;
  eraserWidth: number;
  setCanvas: React.Dispatch<React.SetStateAction<any | null>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setEraserWidth: React.Dispatch<React.SetStateAction<number>>;
}
