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

export function HomeComponent() {
  const userState = useCustomState();
  console.log(userState);
  return (
    <div>
      <div className='container flex divide-x-2 '>
        <div className='flex-column w-full'>
          <div className='flex'>
            <div className='flex-auto font-bold text-left pt-1 pl-3'>라이브 강의</div>
            <div className='flex flex-row pr-10'>
              <JumpToCreateRoomComponent></JumpToCreateRoomComponent>
              &nbsp;
              <JumpToShowMoreRoomComponent></JumpToShowMoreRoomComponent>
            </div>
          </div>
          <RoomListComponent></RoomListComponent>
        </div>
        <div className='flex rounded-xl w-full m-1'>
          <div className='flex-auto font-bold text-left pl-3'>드로잉 강의</div>
        </div>
      </div>
    </div>
  );
}
