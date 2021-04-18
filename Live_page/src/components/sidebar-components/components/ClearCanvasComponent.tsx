import React from 'react';

import { ClearCanvasComponentProps } from '../interfaces/clear-canvas-interfaces';

function ClearCanvasComponent(props: ClearCanvasComponentProps) {
  function downloadImage() {
    const userId = props.roomInfo.userId;
    if (!userId) return;
    const userCanvas: any = document.getElementById(userId);
    if (userCanvas) {
      const userCtx = userCanvas.getContext('2d');
      userCtx.clearRect(
        0,
        0,
        (window.innerWidth - 60) * 0.5,
        window.innerHeight,
      );
      //   const saveImage = saveCanvas.toDataURL('image/png');
      //   const a: any = document.createElement('a');
      //   a.download = 'image.png';
      //   a.href = saveImage;
      //   a.click();
      //   a.delete;
    }
  }

  const chatButtonStyle =
    'flex justify-center items-center w-20 h-20 cursor-pointer';
  const inactiveStyle = 'text-gray-500 hover:text-blue-600';

  return (
    <>
      <div
        className={`${chatButtonStyle} ${inactiveStyle}`}
        onClick={downloadImage}
      >
        <i className={'ri-2x ri-delete-bin-line'}></i>
      </div>
    </>
  );
}

export default ClearCanvasComponent;
