import React from 'react';
import ColorPaletteComponent from './ColorPaletteComponent';
import EraseSizeComponent from './EraseSizeComponent';
import LineSizeComponent from './LineSizeComponent';
import ToolSelectComponent from './ToolSelectComponent';

import { ToolbarComponentProps } from '../interfaces/toolbar-interfaces';
import '../index.css';

function ToolbarComponent(props: ToolbarComponentProps) {
  return (
    <>
      <div className='absolute bottom-0 inset-x-1/2 z-40 w-2/3 h-20 shadow-3xl bg-white transform -translate-x-1/2 flex flex-row'>
        {/* <AddImageComponent canvas={canvas} /> */}
        <div className='flex-grow'></div>
        <ToolSelectComponent
          activeTool={props.activeTool}
          color={props.color}
          eraserWidth={props.eraserWidth}
          lineWidth={props.lineWidth}
          setActiveTool={props.setActiveTool}
          setCursorWidth={props.setCursorWidth}
        />
        {props.activeTool !== 'eraser' ? (
          <LineSizeComponent
            activeTool={props.activeTool}
            cursorWidth={props.cursorWidth}
            lineWidth={props.lineWidth}
            setCursorWidth={props.setCursorWidth}
            setLineWidth={props.setLineWidth}
          />
        ) : (
          <EraseSizeComponent
            activeTool={props.activeTool}
            cursorWidth={props.cursorWidth}
            eraserWidth={props.eraserWidth}
            setCursorWidth={props.setCursorWidth}
            setEraserWidth={props.setEraserWidth}
          />
        )}

        <div className='flex-grow'></div>
        <ColorPaletteComponent color={props.color} setColor={props.setColor} />
        <div className='flex-grow'></div>
      </div>
    </>
  );
}

export default ToolbarComponent;
