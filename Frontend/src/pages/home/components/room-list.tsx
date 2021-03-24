import React, { useState, useEffect } from 'react';
import './room-list.css';
import { EntranceComponent } from './entrance';
import { EntranceProps } from '../interfaces/entrance-props-interface';

const axios = require('axios');

export function RoomListComponet() {
  const [rooms, setRooms] = useState<EntranceProps[]>([]);

  useEffect(() => {
    // axios.get('/').then((res: ResponseEntranceProps) => setRooms(res.data));
    setRooms([{ roomKey: 'a', roomTitle: 'b', roomHost: 'c' }]);
  });
  return (
    <div className='roomList'>
      {rooms.map((room: EntranceProps, index: number) => {
        return (
          <div key={index}>
            <EntranceComponent roomKey={room.roomKey} roomTitle={room.roomTitle} roomHost={room.roomHost} />;
          </div>
        );
      })}
    </div>
  );
}
