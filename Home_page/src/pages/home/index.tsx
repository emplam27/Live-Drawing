import React, { useState, useEffect } from 'react';
import { useCustomState } from '../../context';
import { RoomListComponent } from './components/room-list';
// import './home.css';

export function HomeComponent() {
  const userState = useCustomState();

  return (
    <div className='container'>
      <div className='lecture-container w-screen'>
        <div className='titleAndButton'>
          <div className='titleContainer pt-20'>
            <div className='title pb- text-center text-5xl font-bold text-blue-400'>
              어느 곳에 있든 그림을 배울 수 있어요
            </div>
            <div>
              <p className='pt-3 text-center text-2xl font-normal text-gray-400 pb-12'>
                선생님이 쉽고 재미있게 알려주실거에요. 걱정은 넣어둬~~
              </p>
            </div>
          </div>
        </div>
        <div className='mx-52'>
          <RoomListComponent></RoomListComponent>
        </div>
      </div>
    </div>
  );
}
