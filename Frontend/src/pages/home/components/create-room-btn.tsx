import React from 'react';
import { Link } from 'react-router-dom';

export function CreateRoomComponent() {
  return (
    <Link to='/room'>
      <button>Create Room</button>
    </Link>
  );
}