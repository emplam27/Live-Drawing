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
    <div onClick={onClick} className={'roomMetadata'}>
      <div className={'roomMetadata'}>
        <div className={'roomImage'}>
          <img src='/Kakao_drawing.jpeg' alt=''></img>
        </div>
        <div className={'roomInfo'}>
          <div className='roomTitle'>{props.roomTitle}</div>
          <div className={'buttonandImage'}>
            <img src='/profile.jpeg' alt=''></img>
            <div className={'name'}>전민동고흐</div>
          </div>
        </div>
      </div>
    </div>

    //  <Link to={`/room/${roomKey}`}>
    //     <div className='entrance'>
    //       <h3>{room_title}</h3>
    //       {/* <h4>방주인 : {room_host}</h4> */}
    //     </div>
    //     {/* //{' '} */}
    //   </Link>
  );
}
