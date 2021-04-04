import React, { useState, useEffect } from 'react';
import { useCustomState } from '../../context';
import { RoomListComponent } from './components/room-list';
import './home.css';

export function HomeComponent() {
  const userState = useCustomState();
  
  return (
    <div className='container'>
      <div className='lecture-container'>
        <div className='titleAndButton'>
          <div className='titleContainer'>
            <div className='title'>
              라이브 강의 &nbsp;
              <i className='ri-live-fill'></i>
            </div>
          </div>
        </div>
        <RoomListComponent></RoomListComponent>
      </div>
      <div className='lecture-container'>
        <div className='title'>드로잉 강의</div>
        <RoomListComponent></RoomListComponent>
      </div>
    </div>
  );
}
