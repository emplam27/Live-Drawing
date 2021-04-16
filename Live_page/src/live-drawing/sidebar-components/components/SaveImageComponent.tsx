import React from 'react';

import { SaveImageComponentProps } from '../interfaces/save-image-interfaces';

function SaveImageComponent(props: SaveImageComponentProps) {
  function downloadImage() {
    const userId = props.roomInfo.userId;
    if (!userId) return;
    const saveCanvas: any = document.getElementById(userId);
    if (saveCanvas) {
      const saveImage = saveCanvas.toDataURL('image/png');
      const a: any = document.createElement('a');
      a.download = 'image.png';
      a.href = saveImage;
      a.click();
      a.delete;
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
        <i className={'ri-2x ri-save-3-line'}></i>
      </div>
    </>
  );
}

export default SaveImageComponent;
