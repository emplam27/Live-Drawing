import React, { useState, useEffect } from 'react';
import {
  JumpToCreateRoomComponent,
  JumpToFeedbackComponent,
  JumpToJoinComponent,
  JumpToLoginComponent,
} from './components/jump-buttons';
import { RoomListComponet } from './components/room-list';

export function HomeComponent() {
  return (
    <div>
      <div className='container flex divide-x-2 border-2 h-mainBox'>
        <div className='flex-column bg-gradient-to-tr from-blue-300 to-blue-0 rounded-xl w-full m-1'>
          <div className='flex'>
            <div className='p-2'>라이브 강의</div>
            <JumpToCreateRoomComponent></JumpToCreateRoomComponent>
          </div>
          <RoomListComponet></RoomListComponet>
        </div>
        <div className='flex bg-gradient-to-tr from-blue-200 to-blue-0 rounded-xl w-full m-1'>
          <div className='p-2'>준비중</div>
        </div>
      </div>
    </div>
  );
}
