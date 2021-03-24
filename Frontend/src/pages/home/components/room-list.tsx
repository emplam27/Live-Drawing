import React, { useState, useEffect } from 'react';
import './room-list.css';
import { EntranceComponent } from './entrance';
import { ResponseRoomInfo, roomInfo } from '../interfaces/room-info-interface';
import axios from 'axios';

export function RoomListComponet() {
  const [rooms, setRooms] = useState<roomInfo[]>([]);
  useEffect(() => {
    axios.get('http://localhost:8080/').then((res: ResponseRoomInfo) => {
      console.log(res.data);
      setRooms(res.data);
    });
  }, []);
  return (
    <>
      <div>room list</div>
      <div className='roomList'>
        {rooms.map((room: roomInfo, index: number) => {
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
