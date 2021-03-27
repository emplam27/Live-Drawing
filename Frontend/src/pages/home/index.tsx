import React, { useState, useEffect } from 'react';
import { CreateRoomComponent, JumpToJoinComponent, JumpToLoginComponent } from './components/jump-buttons';
import { RoomListComponet } from './components/room-list';

export function HomeComponent() {
  return (
    <div>
      <CreateRoomComponent></CreateRoomComponent>
      <JumpToLoginComponent></JumpToLoginComponent>
      <JumpToJoinComponent></JumpToJoinComponent>
      <RoomListComponet></RoomListComponet>
    </div>
  );
}
