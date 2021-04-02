import React, { useState, useEffect } from 'react';
import '../index.css';
import { CursorComponentProps } from '../interfaces/cursor-interfaces';

function CursorComponent(props: CursorComponentProps) {
  const [hidden, setHidden] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const onMouseMove = (e: MouseEvent): void => {
    setPosition({ x: e.clientX, y: e.clientY });
    console.log({ x: e.clientX, y: e.clientY });
  };

  const onMouseLeave = (): void => {
    setHidden(true);
  };

  const onMouseEnter = (): void => {
    setHidden(false);
  };

  const addEventListeners = (): void => {
    const targetCanvasContainer: HTMLElement | null = document.getElementById(
      'canvasContainer',
    );
    targetCanvasContainer?.addEventListener('mousemove', onMouseMove);
    targetCanvasContainer?.addEventListener('mouseenter', onMouseEnter);
    targetCanvasContainer?.addEventListener('mouseleave', onMouseLeave);
  };

  const removeEventListeners = (): void => {
    const targetCanvasContainer: HTMLElement | null = document.getElementById(
      'canvasContainer',
    );
    targetCanvasContainer?.removeEventListener('mousemove', onMouseMove);
    targetCanvasContainer?.removeEventListener('mouseenter', onMouseEnter);
    targetCanvasContainer?.removeEventListener('mouseleave', onMouseLeave);
  };

  // const range = document.getElementById('pencilSlider')
  // if (range) {
  //   range.addEventListener('input', handleRangeChange)
  // }

  useEffect(() => {
    addEventListeners();
    return (): void => removeEventListeners();
  }, []);

  useEffect(() => {
    // console.log('cursor : ', cursorWidth);
  }, [props.cursorWidth]);

  return (
    <div
      className={hidden ? 'cursor cursor--hidden ' : 'cursor'}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${props.cursorWidth}px`,
        height: `${props.cursorWidth}px`,
      }}
    />
  );
}

export default CursorComponent;
