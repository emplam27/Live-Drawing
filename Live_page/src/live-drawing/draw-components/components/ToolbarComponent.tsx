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
      <div className='absolute inset-1/2 flush vstack z-40'>
        <div className='menubar hstack'>
          <div className='spacer'></div>
          {/* <AddImageComponent canvas={canvas} /> */}

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

          <div className='spacer'></div>
          <ColorPaletteComponent
            color={props.color}
            setColor={props.setColor}
          />
          <div className='spacer'></div>
        </div>
      </div>
    </>
  );
}

export default ToolbarComponent;
