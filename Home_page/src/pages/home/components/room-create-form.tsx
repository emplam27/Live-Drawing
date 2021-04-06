import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useCustomState } from '../../../context';
import { CreateRoom } from '../interfaces/create-room-interface';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export default function RoomCreateComponent() {
  const userState = useCustomState();
  const MySwal = withReactContent(Swal);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  const [values, setValues] = useState<CreateRoom>({
    roomTitle: '',
    roomPassword: '',
    roomHostId: '',
  });

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserId(localStorage.getItem('userId'));
  }, [userState]);

  useEffect(() => {
    setValues({ ...values, roomHostId: localStorage.getItem('userId') });
  }, [userState]);

  const changeRoomTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const changeRoomPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (token === null || userId === null) {
      MySwal.fire({
        title: '로그인을 해주세요.',
      });
      return;
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}/room`, values, { headers: headers })
      .then((response) => {
        if (response.status === 200) {
          window.location.href = `${process.env.REACT_APP_DRAWING_URL}/${response.data['roomId']}`;
        }
      })
      .catch(() => {
        // MySwal.showValidationMessage('해당 방을 만들 수 없습니다.');
        MySwal.fire({
          title: '재로그인이 필요합니다.',
        });
      });
  };
  return (
    <div>
      <div className='w-full flex justify-center items-center  h-mainBox'>
        <div className='bg-image w-full sm:w-1/2 md:w-9/12 lg:w-4/6 lg:h-2/3 mx-3 md:mx-5 lg:mx-0 shadow-md flex flex-col md:flex-row items-center rounded z-10 overflow-hidden bg-center bg-cover bg-blue-600'>
          <div className='w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-25 bg-blue-600 backdrop p-1'>
            <h1 className='text-3xl md:text-4xl font-extrabold text-white my-2 md:my-0'>방구석 화방</h1>
            <p className='mb-2 text-white text-xl hidden md:block'>당신도 화가가 될 수 있습니다.</p>
          </div>
          <div className='w-full h-full md:w-1/2 flex flex-col items-center bg-white py-5 md:py-8 px-4'>
            <h3 className='mb-16 my font-bold text-4xl flex items-center text-blue-400'>방 만들기</h3>
            <form action='#' className='px-3 flex flex-col justify-center items-center w-full gap-10'>
              <label className='text-left w-10/12 text-blue-400 font-bold '>
                방 제목
                <input
                  type='text'
                  name='roomTitle'
                  placeholder='제목을 입력하세요.'
                  onChange={changeRoomTitle}
                  className='px-4 py-2 mt-1 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
                />
              </label>
              <label className='text-left w-10/12 text-blue-400 font-bold '>
                비밀번호
                <input
                  type='password'
                  name='roomPassword'
                  placeholder='비밀번호를 입력하세요.'
                  onChange={changeRoomPassword}
                  className='px-4 py-2 mt-1 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
                />
              </label>
              <button
                onClick={onClick}
                className='w-10/12 h-14 mt-5 p5-20 font-semibold  rounded-lg shadow-md text-white bg-gradient-to-tr from-blue-300 to-blue-400 hover:bg-blue-500'
              >
                들어갈래요 :)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
