import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './room-list.css';
import { EntranceProps } from '../interfaces/entrance-props-interface';

export function EntranceComponent(props: EntranceProps) {
  const uuidHandler = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const values = { roomPk: props.roomPk, roomKey: props.roomKey };
    console.log('send val', values);
    axios.post('http://localhost:8080/room/entrance', values).then((res) => {
      console.log('post val', values);
      console.log(res);
      window.location.href = `/room/${props.roomKey}`;
    });
  };

  return (
    <>
      <button onClick={uuidHandler}>{props.roomTitle}</button>
    </>

    //  <Link to={`/room/${roomKey}`}>
    //     <div className='entrance'>
    //       <h3>{room_title}</h3>
    //       {/* <h4>방주인 : {room_host}</h4> */}
    //     </div>
    //     {/* //{' '} */}
    //   </Link>
  );
}
