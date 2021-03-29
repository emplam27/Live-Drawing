import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './room-list.css';
import { EntranceProps } from '../interfaces/entrance-props-interface';

export function EntranceComponent(props: EntranceProps) {
  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const values = { roomPk: props.roomPk, roomKey: props.roomKey };
    axios.post('http://localhost:8080/room/entrance', values).then((res) => {
      window.location.href = `/room/${props.roomKey}`;
    });
  };

  return (
    <>
      <div className='border-2 w-48 h-48 m-3' onClick={onClick}>
        <h2>{props.roomTitle}</h2>
      </div>
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
