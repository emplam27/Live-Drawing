import React, { useState, useEffect } from 'react';

import { CursorComponentProps } from '../interfaces/cursor-interfaces';
import '../../DrawComponent.css';

function CursorComponent(props: CursorComponentProps) {
  // const [hidden, setHidden] = useState(false);
  // const [position, setPosition] = useState({
  //   x: window.innerWidth,
  //   y: window.innerHeight,
  // });

  // const onMouseMove = (e: MouseEvent): void => {
  //   console.log('mousemove');
  //   setPosition({ x: e.clientX, y: e.clientY });
  // };

  // const onTouchMove = (e: TouchEvent): void => {
  //   console.log('touchmove');
  //   setPosition({
  //     x: e.changedTouches[0].clientX,
  //     y: e.changedTouches[0].clientY,
  //   });
  // };

  // const onMouseLeave = (): void => {
  //   console.log('mouseleave');
  //   setHidden(true);
  // };

  // const onMouseEnter = (): void => {
  //   console.log('mouseenter');
  //   setHidden(false);
  // };

  // const addEventListeners = (): void => {
  //   const targetCanvasContainer: HTMLElement | null = document.getElementById(
  //     'drawable-canvas',
  //   );
  //   targetCanvasContainer?.addEventListener('mousemove', (e) => onMouseMove(e));
  //   targetCanvasContainer?.addEventListener('touchmove', (e) => onTouchMove(e));
  //   targetCanvasContainer?.addEventListener('mouseenter', () => onMouseEnter());
  //   targetCanvasContainer?.addEventListener('mouseleave', () => onMouseLeave());
  // };

  // const removeEventListeners = (): void => {
  //   const targetCanvasContainer: HTMLElement | null = document.getElementById(
  //     'drawable-canvas',
  //   );
  //   targetCanvasContainer?.removeEventListener('mousemove', onMouseMove);
  //   targetCanvasContainer?.removeEventListener('touchmove', onTouchMove);
  //   targetCanvasContainer?.removeEventListener('mouseenter', onMouseEnter);
  //   targetCanvasContainer?.removeEventListener('mouseleave', onMouseLeave);
  // };

  // useEffect(() => {
  //   addEventListeners();
  //   return (): void => removeEventListeners();
  // }, []);

  return (
    <div
      className={props.hidden ? 'cursor cursor--hidden ' : 'cursor'}
      style={{
        left: `${props.position.x}px`,
        top: `${props.position.y}px`,
        width: `${props.cursorWidth}px`,
        height: `${props.cursorWidth}px`,
      }}
    />
  );
}

export default CursorComponent;
