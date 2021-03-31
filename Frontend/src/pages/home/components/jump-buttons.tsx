import React from 'react';
import { Link } from 'react-router-dom';
export function JumpToCreateRoomComponent() {
  return (
    <Link to='/room' className='p-1'>
      {/* <button className='py-1 px-3 font-semibold rounded-lg shadow-md text-white bg-blue-400 hover:bg-blue-500 text-sm'> */}
      <div className='text-blue-400 text-base font-bold flex items-center'>
        <i className='ri-live-line'></i>
        <span> &nbsp; 방만들기</span>
      </div>
      {/* </button> */}
    </Link>
  );
}

export function JumpToShowMoreRoomComponent() {
  return (
    <Link to='/room/list' className='p-1'>
      <div className='text-blue-400 text-base font-bold flex items-center'>
        <i className='ri-search-line'></i>
        <span> &nbsp; 더보기</span>
      </div>
    </Link>
  );
}

export function JumpToLoginComponent() {
  return (
    <Link to='/login-form'>
      <button className='py-1 px-3 font-semibold  rounded-lg shadow-md text-white bg-gradient-to-tr from-blue-300 to-blue-400 hover:bg-blue-500'>
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
