import React, { useState, useEffect } from 'react';
import { useCustomState } from '../../context';
import {
  JumpToCreateRoomComponent,
  JumpToFeedbackComponent,
  JumpToJoinComponent,
  JumpToLoginComponent,
  JumpToShowMoreRoomComponent,
} from './components/jump-buttons';
import RoomCreateComponent from './components/room-create-form';
import { RoomListComponent } from './components/room-list';
import './home.css';

export function HomeComponent() {
  const userState = useCustomState();
  console.log(userState);
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
        {/* <JumpToCreateRoomComponent></JumpToCreateRoomComponent>
              &nbsp;
              <JumpToShowMoreRoomComponent></JumpToShowMoreRoomComponent> */}
        {/* <div className='rooms'> */}
        {/* </div> */}
      </div>
      <div className='lecture-container'>
        <div className='title'>드로잉 강의</div>
        {/* <div className='rooms'> */}
        <RoomListComponent></RoomListComponent>
        {/* </div> */}
      </div>
    </div>
  );
}
