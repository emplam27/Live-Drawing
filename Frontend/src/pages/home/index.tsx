import React, { useState, useEffect } from 'react';
import {
  CreateRoomComponent,
  JumpToFeedbackComponent,
  JumpToJoinComponent,
  JumpToLoginComponent,
} from './components/jump-buttons';
import { RoomListComponet } from './components/room-list';

export function HomeComponent() {
  return (
    <div>
      <CreateRoomComponent></CreateRoomComponent>
      <JumpToLoginComponent></JumpToLoginComponent>
      <JumpToJoinComponent></JumpToJoinComponent>
      <RoomListComponet></RoomListComponet>
      <JumpToFeedbackComponent></JumpToFeedbackComponent>
    </div>
  );
}
