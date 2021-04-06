import React, { useEffect } from 'react';
import { SaveImageComponentProps } from '../interfaces/save-image-interfaces';
import { RoomInfo } from '../../interfaces/socket-interfaces';

export function SaveImageComponent(props: SaveImageComponentProps) {
  function downloadImage() {
    const userId = props.roomInfo.userId;
    if (!userId) return;
    const saveCanvas: any = document.getElementById(userId);
    if (saveCanvas) {
      const saveImage = saveCanvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = 'image.png';
      a.href = saveImage;
      a.click();
    }
  }
  return (
    <>
      <i className={'ri-2x ri-save-3-line'} onClick={() => downloadImage()}></i>
    </>
  );
}

export default SaveImageComponent;
