import { PeerConnectionContext } from '../../interfaces/draw-components-interfaces';

export interface ToolbarComponentProps {
  activeTool: string;
  color: string;
  cursorWidth: number;
  eraserWidth: number;
  lineWidth: number;
  setActiveTool: React.Dispatch<React.SetStateAction<string>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
  setCursorWidth: React.Dispatch<React.SetStateAction<number>>;
  setLineWidth: React.Dispatch<React.SetStateAction<number>>;
  setEraserWidth: React.Dispatch<React.SetStateAction<number>>;
}
