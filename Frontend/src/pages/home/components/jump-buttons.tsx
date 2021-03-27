import React from 'react';
import { Link } from 'react-router-dom';

export function CreateRoomComponent() {
  return (
    <Link to='/room'>
      <button>Create Room</button>
    </Link>
  );
}

export function JumpToLoginComponent() {
  return (
    <Link to='/login-form'>
      <button>로그인</button>
    </Link>
  );
}

export function JumpToJoinComponent() {
  return (
    <Link to='/user/join-form'>
      <button>회원가입</button>
    </Link>
  );
}

export function JumpToFeedbackComponent() {
  return (
    <Link to='/feedback'>
      <button>피드백 작성하기</button>
    </Link>
  );
}
