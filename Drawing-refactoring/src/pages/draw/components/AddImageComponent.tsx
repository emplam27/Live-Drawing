import React, { useEffect } from 'react';
import '../index.css';
import { AddImageComponentProps } from '../interfaces/add-image-interfaces';
import { fabric } from 'fabric';

function AddImageComponent(props: AddImageComponentProps) {
  function addImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files;
    if (!file) return;
    console.log(file[0]);
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

  function saveImage() {
    console.log('saveImage');
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
      <p className={''}>
        <i className={'icon-link center ri-xl ri-image-add-line'}></i>
      </p>
      <input type='file' onChange={addImage}></input>
      <a onClick={saveImage} download>
        save image
      </a>
    </>
  );
}

export default AddImageComponent;
