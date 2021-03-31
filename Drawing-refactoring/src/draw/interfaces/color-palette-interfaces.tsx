export interface ColorPaletteComponentProps {
  canvas: any | null;
  color: string;
  setCanvas: React.Dispatch<React.SetStateAction<any | null>>;
  setColor: React.Dispatch<React.SetStateAction<string>>;
}
