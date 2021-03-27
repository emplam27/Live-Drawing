import React, { useState, useEffect } from 'react';
import '../index.css';

interface CursorComponentProps {
  cursorWidth: number;
}

function CursorComponent({ cursorWidth }: CursorComponentProps) {
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
    const targetCanvasContainer: any = document.getElementById(
      'canvasContainer',
    );
    targetCanvasContainer?.addEventListener('mousemove', onMouseMove);
    targetCanvasContainer?.addEventListener('mouseenter', onMouseEnter);
    targetCanvasContainer?.addEventListener('mouseleave', onMouseLeave);
  };

  const removeEventListeners = () => {
    const targetCanvasContainer: any = document.getElementById(
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
    return () => removeEventListeners();
  }, []);

  useEffect(() => {
    // console.log('cursor : ', cursorWidth);
  }, [cursorWidth]);

  return (
    <div
      className={hidden ? 'cursor cursor--hidden ' : 'cursor'}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${cursorWidth}px`,
        height: `${cursorWidth}px`,
      }}
    />
  );
}

export default CursorComponent;
