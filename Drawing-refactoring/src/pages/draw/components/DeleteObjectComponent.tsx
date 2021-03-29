import React, { useEffect } from 'react';
import '../index.css';
import { DeleteObjectComponentProps } from '../interfaces/delete-object-interfaces';
import { fabric } from 'fabric';

function DeleteObjectComponent(props: DeleteObjectComponentProps) {
  function deleteObject() {
    if (!props.canvas) return;
    //Get currently-selected object
    const obj = props.canvas.getActiveObject();

    //Delete currently-selected object
    props.canvas.remove(obj);
    props.canvas.renderAll(); //Re-render the drawing in Fabric
  }

  return (
    <>
      <p className={'icon-link center'} onClick={deleteObject}>
        <i className={'ri-xl ri-delete-bin-line'}></i>
      </p>
    </>
  );
}

export default DeleteObjectComponent;