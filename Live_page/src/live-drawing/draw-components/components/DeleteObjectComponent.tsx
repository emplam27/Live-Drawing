import React from 'react';
import { DeleteObjectComponentProps } from '../interfaces/delete-object-interfaces';
import '../index.css';

function DeleteObjectComponent(props: DeleteObjectComponentProps) {
  function deleteObject(): void {
    // if (!props.canvas) return;
    // //Get currently-selected object
    // const obj = props.canvas.getActiveObject();
    // //Delete currently-selected object
    // props.canvas.remove(obj);
    // props.canvas.renderAll(); //Re-render the drawing in Fabric
  }

  return (
    <>
      <p className={'icon-link center'} onClick={deleteObject}>
        <i className={'ri-2x ri-delete-bin-line'}></i>
      </p>
    </>
  );
}

export default DeleteObjectComponent;
