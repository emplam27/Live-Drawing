import React from 'react';
import { LectureStartComponentProps } from '../interfaces/lecture-start-interfaces';
import loadingImg from '../../../../jungle.svg';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function LectureStartComponent(props: LectureStartComponentProps) {
  const MySwal = withReactContent(Swal);

  function lectureStart() {
    if (!props.socket) return;
    console.log('class started');
    props.setIsLectureStarted(true);
    props.socket.emit('lecture-start');
    MySwal.fire({
      title: `${props.roomInfo.roomTitle}수업이 시작되었습니다`,
      text: '2초 뒤어 수업이 시작됩니다.',
      icon: 'success',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      allowOutsideClick: false,
    });
  }
  return (
    <div className='absolute z-40 flex flex-col justify-center w-full h-full bg-gray-100'>
      {props.roomInfo.roomHostId === props.roomInfo.userId ? (
        <div className='my-auto'>
          <p className='text-5xl text-blue-400 font-bold '>안녕하세요 선생님</p>
          <div className='mt-24 text-3xl'>
            <p>
              하단 <span className='text-blue-400 font-bold'>수업시작 </span>
              버튼을 누르면 수업이 시작됩니다.
            </p>
          </div>
          <div className='pt-12 text-3xl'>
            <p className='pb-12'>
              <span className='text-blue-400 font-bold'>첨삭모드</span>로 학생의
              그림을 첨삭할 수 있습니다.
            </p>
            <p className='pb-5 text-3xl'>
              <span className='text-blue-400 font-bold'> 음성, 채팅 </span>
              기능을 통해 학생과 소통할 수 있습니다.
            </p>
          </div>
          <div className='mt-52 mb-20'>
            <button
              onClick={lectureStart}
              className='py-1 px-2 w-4/12 h-20 font-semibold text-4xl rounded-lg shadow-md text-white bg-gradient-to-tr from-blue-300 to-blue-400 hover:bg-blue-500'
            >
              수업시작
            </button>
          </div>
        </div>
      ) : (
        <div className='my-auto mt-32'>
          <p className='text-5xl text-blue-400 font-bold pb-8'>
            아직 수업이 시작되지 않았어요!
          </p>
          <div className='pt-20 text-3xl'>
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
          <div className='mt-60 self-center'>
            <img
              className='animate-bounce w-60 h-60 mx-auto text-gray-900'
              src={loadingImg}
            ></img>
          </div>
        </div>
      )}
    </div>
  );
}
export default LectureStartComponent;
