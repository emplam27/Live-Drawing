import React from 'react';
import '../index.css';
import { AddImageComponentProps } from '../interfaces/add-image-interfaces';
import { fabric } from 'fabric';

function AddImageComponent(props: AddImageComponentProps) {
  function addImage(event: React.ChangeEvent<HTMLInputElement>): void {
    const file = event.currentTarget.files;
    if (!file) return;
    const reader = new FileReader();

    reader.onload = function (e) {
      if (!e.target) return;
      const data: any = e.target.result;
      if (!data) return;

      fabric.Image.fromURL(data, function (img) {
        if (!props.canvas || !img || !img.width || !img.height) return;
        const ratio = (props.canvas.height / img.height) * 0.3;
        const image = img.set({
          scaleX: ratio,
          scaleY: ratio,
        });
        props.canvas.add(image);
        props.canvas.setActiveObject(image);
      });
    };
    reader.readAsDataURL(file[0]);
  }

  function saveImage(): void {
    const a = document.createElement('a');
    a.download = 'image.png';
    a.href = props.canvas.toDataURL({
      format: 'png',
      quailty: 1,
    });
    a.click();
  }

  return (
    <>
      <label className={'icon-link center '} htmlFor='file-input'>
        <i className={'ri-2x ri-image-add-line'}></i>
      </label>
      <input
        id='file-input'
        type='file'
        onChange={addImage}
        style={{ display: 'none' }}
      />
      <label className={'icon-link center '} htmlFor='save-button'>
        <i className={'ri-2x ri-save-3-line'}></i>
      </label>
      <button id='save-button' onClick={saveImage} style={{ display: 'none' }}>
        save image
      </button>
    </>
  );
}

export default AddImageComponent;
