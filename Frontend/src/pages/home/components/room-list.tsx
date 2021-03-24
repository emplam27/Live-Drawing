import React, { useState, useEffect } from 'react';
import styles from './room-list.module.css';
import { ResponseEntranceProps, EntranceComponent, EntranceProps } from './entrance';
const axios = require('axios');

interface Temp {
  roomPk: number;
  roomKey: string;
  roomTitle: string;
  members: {
    memberPk: number;
    memberName: string;
    // room_pk: number;
  };
}

interface ResponseTemp {
  data: Temp[];
}

export function RoomListComponet() {
  const [rooms, setRooms] = useState<Temp[]>([]);
  useEffect(() => {
    axios.get('http://localhost:8080/').then((res: ResponseTemp) => {
      console.log(res.data);
      setRooms(res.data);
    });
  }, []);
  return (
    <>
      <div>room list</div>
      <div className={styles.roomList}>
        {rooms.map((room: Temp, index: number) => {
          console.log(room);
          return (
            <div key={index}>
              <EntranceComponent roomPk={room.roomPk} roomKey={room.roomKey} roomTitle={room.roomTitle} />
              <br />
            </div>
          );
        })}
      </div>
    </>
  );
}
