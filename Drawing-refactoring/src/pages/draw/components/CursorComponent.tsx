import React, { useState, useEffect } from 'react';
import '../index.css';
import { CursorComponentProps } from '../interfaces/cursor-interfaces';

function CursorComponent(props: CursorComponentProps) {
  const [hidden, setHidden] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const onMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const onMouseLeave = () => {
    setHidden(true);
  };

  const onMouseEnter = () => {
    setHidden(false);
  };

  const addEventListeners = () => {
    const targetCanvasContainer: HTMLElement | null = document.getElementById(
      'canvasContainer',
    );
<<<<<<< HEAD
    targetCanvasContainer?.addEventListener('mousemove', onMouseMove);
    targetCanvasContainer?.addEventListener('mouseenter', onMouseEnter);
    targetCanvasContainer?.addEventListener('mouseleave', onMouseLeave);
=======
    if (targetCanvasContainer != null) {
      targetCanvasContainer.addEventListener('mousemove', onMouseMove);
      targetCanvasContainer.addEventListener('mouseenter', onMouseEnter);
      targetCanvasContainer.addEventListener('mouseleave', onMouseLeave);
    }
>>>>>>> e9a1086e1f25d93177357cc0f9b1f4472f3f9433
  };

  const removeEventListeners = () => {
    const targetCanvasContainer: HTMLElement | null = document.getElementById(
      'canvasContainer',
    );
<<<<<<< HEAD
    targetCanvasContainer?.removeEventListener('mousemove', onMouseMove);
    targetCanvasContainer?.removeEventListener('mouseenter', onMouseEnter);
    targetCanvasContainer?.removeEventListener('mouseleave', onMouseLeave);
=======
    if (targetCanvasContainer != null) {
      targetCanvasContainer.removeEventListener('mousemove', onMouseMove);
      targetCanvasContainer.removeEventListener('mouseenter', onMouseEnter);
      targetCanvasContainer.removeEventListener('mouseleave', onMouseLeave);
    }
>>>>>>> e9a1086e1f25d93177357cc0f9b1f4472f3f9433
  };

  // const range = document.getElementById('pencilSlider')
  // if (range) {
  //   range.addEventListener('input', handleRangeChange)
  // }

  useEffect(() => {
    addEventListeners();
    return () => removeEventListeners();
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
