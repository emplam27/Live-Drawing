import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './room-list.module.css';

interface EntranceProps {
  roomKey: string;
  roomTitle: string;
  roomPk: number;
  // room_host: number;
}

interface ResponseEntranceProps {
  data: EntranceProps[];
}

function EntranceComponent({ roomPk, roomKey, roomTitle }: EntranceProps) {
  const uuidHandler = (e: any) => {
    const values = { roomPk: roomPk, roomKey: roomKey };
    console.log('send val', values);
    axios.post('http://localhost:8080/room/entrance', values).then((res) => {
      console.log('post val', values);
      console.log(res);
      window.location.href = `/room/${roomKey}`;
    });
  };

  return (
    <>
      <button onClick={uuidHandler}>{roomTitle}</button>
    </>

    //  <Link to={`/room/${roomKey}`}>
    //     <div className={styles.entrance}>
    //       <h3>{room_title}</h3>
    //       {/* <h4>방주인 : {room_host}</h4> */}
    //     </div>
    //     {/* //{' '} */}
    //   </Link>
  );
}

export { EntranceProps, ResponseEntranceProps, EntranceComponent };