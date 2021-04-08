import React, { useState } from 'react';

import PeersLayerComponent from './PeersLayerComponent';
import MyLayerComponent from './MyLayerComponent';

import { LayerGridComponentProps } from '../interfaces/layer-grid-interfaces';

function LayerGridComponent(props: LayerGridComponentProps) {
  const [activeTool, setActiveTool] = useState<string>('');
  const [color, setColor] = useState('#000000');
  const [eraserWidth, setEraserWidth] = useState(30);
  const [lineWidth, setLineWidth] = useState(5);

  return (
    <>
      <div
        id='canvasContainer'
        className='w-full grid grid-cols-2 divide-x-4 divide-dashed divide-gray-300'
      >
        <div className='cols-start-1 cols-end-2 relative'>
          {props.layers.length > 1 ? (
            <PeersLayerComponent
              activeTool={activeTool}
              canvasCtxTable={props.canvasCtxTable}
              color={color}
              eraserWidth={eraserWidth}
              layers={props.layers}
              lineWidth={lineWidth}
              roomInfo={props.roomInfo}
              socket={props.socket}
              topLayer={props.topLayer}
              setTopLayer={props.setTopLayer}
            />
          ) : (
            <div className='flex flex-col justify-center h-full'>
              <p>
                <i className='ri-group-line text-8xl text-gray-300'></i>
              </p>
              <p className='text-xl '>참여한 게스트가 없습니다!</p>
              <p className='text-xl'>게스트가 참여하면 여기에 표시됩니다.</p>
            </div>
          )}
        </div>
        <div className='cols-start-2 cols-end-3 relative'>
          <MyLayerComponent
            activeTool={activeTool}
            canvasCtxTable={props.canvasCtxTable}
            color={color}
            cursorWidth={props.cursorWidth}
            eraserWidth={eraserWidth}
            lineWidth={lineWidth}
            roomInfo={props.roomInfo}
            socket={props.socket}
            topLayer={props.topLayer}
            setActiveTool={setActiveTool}
            setColor={setColor}
            setCursorWidth={props.setCursorWidth}
            setEraserWidth={setEraserWidth}
            setLineWidth={setLineWidth}
          />
        </div>
      </div>
    </>
  );
}

export default LayerGridComponent;
