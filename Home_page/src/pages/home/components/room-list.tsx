import React, { useState, useEffect } from 'react';
import { EntranceComponent } from './entrance';
import { ResponseRoomInfo } from '../interfaces/room-info-interface';
import axios from 'axios';
import './room-list.css';
import { EntranceProps } from '../interfaces/entrance-props-interface';
export function RoomListComponent() {
  const [rooms, setRooms] = useState<EntranceProps[]>([]);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}`).then((res: ResponseRoomInfo) => {
      setRooms(res.data);
    });
  }, []);
  return (
    <>
<<<<<<< HEAD
      <div className='roomList grid grid-cols-4 gap-1 pt-10 flex-justify-center'>
=======
      <div className='roomList grid grid-cols-4 gap-5 pt-10 flex-justify-center w-full'>
>>>>>>> 57f2322a09a93c0925b8e13f6f559c9a931d945d
        {rooms.map((room: EntranceProps, index: number) => {
          return (
            <div key={index}>
              <EntranceComponent roomHostname={room.roomHostname} roomId={room.roomId} roomTitle={room.roomTitle} />
              <br />
            </div>
          );
        })}
      </div>
    </>
  );
}
