import React, { useState, useEffect, useRef } from 'react';
import { down, move, up, key, forceChanged } from '../../../functions/draw';
import classNames from 'classnames';
import { AnyCnameRecord } from 'node:dns';
import '../index.css';

interface CursorComponentProps {
  cursorWidth: number;
}

function CursorComponent({ cursorWidth }: CursorComponentProps) {
  const [position, setPosition] = useState({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    addEventListeners();
    return () => removeEventListeners();
  }, []);

  const addEventListeners = () => {
    const targetCanvasContainer: any = document.getElementById('canvasContainer');
    targetCanvasContainer.addEventListener('mousemove', onMouseMove);
    targetCanvasContainer.addEventListener('mouseenter', onMouseEnter);
    targetCanvasContainer.addEventListener('mouseleave', onMouseLeave);
  };

  const removeEventListeners = () => {
    const targetCanvasContainer: any = document.getElementById('canvasContainer');
    targetCanvasContainer.removeEventListener('mousemove', onMouseMove);
    targetCanvasContainer.removeEventListener('mouseenter', onMouseEnter);
    targetCanvasContainer.removeEventListener('mouseleave', onMouseLeave);
  };

  const onMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
  };

  const onMouseLeave = () => {
    setHidden(true);
  };
  // const range = document.getElementById('pencilSlider')
  // if (range) {
  //   range.addEventListener('input', handleRangeChange)
  // }
  const onMouseEnter = () => {
    setHidden(false);
  };

  const cursorClasses = classNames('cursor', {
    'cursor--hidden': hidden,
  });

  useEffect(() => {
    console.log('cursor : ', cursorWidth);
    console.log('is done');
  }, [cursorWidth]);

  return (
    <div
      className={cursorClasses}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        visibility: 'hidden',
        width: `${cursorWidth}px`,
        height: `${cursorWidth}px`,
      }}
    />
  );
}

export default CursorComponent;
