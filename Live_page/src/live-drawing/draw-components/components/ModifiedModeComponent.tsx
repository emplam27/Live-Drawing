import React, { useState } from 'react';

import { ModifiedModeComponentProps } from '../interfaces/modified-mode-interfaces';

function ModifiedModeComponent(props: ModifiedModeComponentProps) {
  return (
    <>
      {props.roomInfo.roomHostId === props.roomInfo.userId ? (
        <div
          id='canvasContainer'
          className='w-full grid grid-cols-2 divide-x-4 divide-dashed divide-gray-300'
        >
          <div className='cols-start-1 cols-end-2 relative'>
            학생 첨삭 레이어
          </div>
          <div className='cols-start-2 cols-end-3 relative'>
            선생님 본인 레이어
          </div>
        </div>
      ) : (
        <div
          id='canvasContainer'
          className='w-full grid grid-cols-2 divide-x-4 divide-dashed divide-gray-300'
        >
          <div className='cols-start-1 cols-end-2 relative'>
            선생님 첨삭 레이어
          </div>
          <div className='cols-start-2 cols-end-3 relative'>본인 레이어</div>
        </div>
      )}
    </>
  );
}

export default ModifiedModeComponent;
