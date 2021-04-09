import React from 'react';

import { LectureStartComponentProps } from '../interfaces/lecture-start-interfaces';

function LectureStartComponent(props: LectureStartComponentProps) {
  function lectureStart() {
    props.setIsLectureStarted(true);
  }

  return (
    <div className='flex flex-col justify-center h-full bg-gray-100'>
      <div className='my-auto'>
        <p className='text-5xl text-blue-400 '>
          아직 수업이 시작되지 않았어요!
        </p>
        <div className='pt-10 text-3xl'>
          <p>수업 전까지 자유롭게 그림을 그릴 수 있어요</p>
          <p className='pt-3'>수업이 시작되면 연습했던 그림은 사라져요</p>
        </div>
        <div className='pt-12 text-3xl'>
          <p className='pb-5'>
            <span className='text-blue-400 font-bold'>왼쪽 화면</span>은
            선생님과 친구들이 그림을 그리는 공간이에요.
          </p>
          <p className='pb-5 text-3xl'>
            {' '}
            <span className='text-blue-400 font-bold'> 오른쪽 화면</span>
            에서 그림을 그려볼까요?
          </p>
        </div>
      </div>

      {props.roomInfo.roomHostId === props.roomInfo.userId ? (
        <button onClick={lectureStart}>수업시작</button>
      ) : (
        <div>학생들이 볼거</div>
      )}

      <div className='my-auto self-center'>
        <img
          className='animate-bounce w-60 h-60 mx-auto text-gray-900'
          src='../../jungle.svg'
        ></img>
      </div>
    </div>
  );
}

export default LectureStartComponent;
