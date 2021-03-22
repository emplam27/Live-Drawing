import React, { useState, useEffect, useRef } from 'react';
import { down, move, up, key, forceChanged } from '../../../functions/draw';
import '../index.css';

interface ToolSelectComponentProps {
  setActiveTool: any;
}

function ToolSelectComponent({ setActiveTool }: ToolSelectComponentProps) {
  const activeToolElementRef = useRef(null);
  let activeToolElement: any = activeToolElementRef.current;

  document.querySelectorAll('[data-tool]').forEach((tool: any) => {
    tool.onclick = function (e: any) {
      activeToolElement.classList.toggle('active');
      activeToolElement = tool;
      activeToolElement.classList.toggle('active');
      setActiveTool(activeToolElement.dataset.tool);
    };
  });

  return (
    <>
      <p className='icon-link center'>
        <i className='ri-lg ri-landscape-line'></i>
      </p>
      <div className='spacer'></div>

      <p ref={activeToolElementRef} className='icon-link active center' data-tool='pencil'>
        <i className='ri-xl ri-pencil-fill'></i>
      </p>
      <p className='icon-link center' data-tool='rect'>
        <i className='ri-xl ri-shape-line'></i>
      </p>
      <p className='icon-link center' data-tool='circle'>
        <i className='ri-xl ri-checkbox-blank-circle-line'></i>
      </p>
      <p className='icon-link center' data-tool='text'>
        <i className='ri-xl ri-font-size-2'></i>
      </p>
      <p className='icon-link center' data-tool='layer'>
        <i className='ri-xl ri-stack-line'></i>
      </p>
      {/* <p className='icon-link center' data-tool='undo'>
        <i className='ri-xl ri-arrow-go-back-line' onClick={Undo}></i>
      </p> */}
      <p className='icon-link center' data-tool='eraser'>
        <i className='ri-xl ri-eraser-line'></i>
      </p>
      <p className='icon-link center' data-tool='paint'>
        <i className='ri-xl ri-paint-fill'></i>
      </p>
    </>
  );
}

export default ToolSelectComponent;
