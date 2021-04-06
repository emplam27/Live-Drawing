import React from 'react';
import '../index.css';
import { CloseButtonComponentProps } from '../interfaces/close-button-interfaces';
import Swal from 'sweetalert2';

function CloseButtonComponent(props: CloseButtonComponentProps) {
  function closeLive() {
    Swal.fire({
      title: '라이브를 종료하시겠습니까?',
      text: '저장하지 않은 그림은 사라집니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        props.setIsLiveClosed(true);
        window.location.replace(`${process.env.REACT_APP_HOMEPAGE_URL}`);
      }
    });
  }

  function exitLive() {
    Swal.fire({
      title: '라이브에서 나가시겠습니까?',
      text: '홈화면으로 이동합니다.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.replace(`${process.env.REACT_APP_HOMEPAGE_URL}`);
      }
    });
  }

  return (
    <>
      {props.roomInfo.roomHostId === props.roomInfo.userId ? (
        <button
          className='w-20 h-20 bg-gray-350 hover:bg-gray-300 text-white font-bold'
          onClick={closeLive}
        >
          <p>라이브</p>
          <p>종료</p>
        </button>
      ) : (
        <button
          className='w-20 h-20 bg-gray-350 hover:bg-gray-300 text-white font-bold'
          onClick={exitLive}
        >
          <p>라이브</p>
          <p>나가기</p>
        </button>
      )}
    </>
  );
}

export default CloseButtonComponent;
