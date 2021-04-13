export const onMouseMove = (
  e: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
  setPosition: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >,
): void => {
  setPosition({ x: e.clientX, y: e.clientY });
};

export const onTouchMove = (
  e: React.TouchEvent<HTMLCanvasElement>,
  setPosition: React.Dispatch<
    React.SetStateAction<{
      x: number;
      y: number;
    }>
  >,
): void => {
  setPosition({
    x: e.changedTouches[0].clientX,
    y: e.changedTouches[0].clientY,
  });
};

export const onMouseLeave = (
  setHidden: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  setHidden(true);
};

export const onMouseEnter = (
  setHidden: React.Dispatch<React.SetStateAction<boolean>>,
): void => {
  setHidden(false);
};
