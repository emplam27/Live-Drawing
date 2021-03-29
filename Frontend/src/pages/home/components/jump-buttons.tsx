import React from 'react';
import { Link } from 'react-router-dom';

export function JumpToCreateRoomComponent() {
  return (
    <Link to='/room' className='p-1'>
      <button className='py-1 px-3 font-semibold rounded-lg shadow-md text-white bg-blue-400 hover:bg-blue-500 text-sm'>
        방 만들기
      </button>
    </Link>
  );
}

export function JumpToLoginComponent() {
  return (
    <Link to='/login-form'>
      <button className='py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-400 hover:bg-blue-500'>
        로그인
      </button>
    </Link>
  );
}

export function JumpToJoinComponent() {
  return (
    <Link to='/user/join-form'>
      <button className='py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-400 hover:bg-blue-500'>
        회원가입
      </button>
    </Link>
  );
}

export function JumpToFeedbackComponent() {
  return (
    <Link to='/feedback'>
      <button className='py-2 px-4 font-semibold rounded-lg shadow-md text-white bg-blue-400 hover:bg-blue-500'>
        피드백 작성하기
      </button>
    </Link>
  );
}
