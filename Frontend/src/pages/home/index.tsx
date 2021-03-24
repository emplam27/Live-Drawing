import React, { useState, useEffect } from 'react';
import { CreateRoomComponent } from './components/create-room-btn';
import { RoomListComponet } from './components/room-list';

function HomeComponent() {
  return (
    <div>
      <CreateRoomComponent></CreateRoomComponent>
      <RoomListComponet></RoomListComponet>
    </div>
  );
}

export default HomeComponent;