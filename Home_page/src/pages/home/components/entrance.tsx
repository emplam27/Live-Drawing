import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './room-list.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { EntranceProps } from '../interfaces/entrance-props-interface';
import { useCustomState } from '../../../context';
import { ResponseRoomInfo } from '../interfaces/room-info-interface';

export function EntranceComponent(props: EntranceProps) {
  const MySwal = withReactContent(Swal);
  const userState = useCustomState();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserId(localStorage.getItem('userId'));
  }, [userState]);

  const getRooms = () => {
    axios.get(`${process.env.REACT_APP_API_URL}`).then((res: ResponseRoomInfo) => {
      props.setRooms(res.data);
    });
  };

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (token === null || userId === null) {
      MySwal.fire({
        title: '로그인을 해주세요.',
      });
      return;
    }
    MySwal.fire({
      title: '비밀번호를 입력하세요.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
        autocomplete: 'off',
      },
      showCancelButton: true,
      preConfirm: (password) => {
        const values = { userId: userId, password: password, roomId: props.roomId };
        return axios
          .post(`${process.env.REACT_APP_API_URL}/room/entrance/`, values, { headers: headers })
          .then((res) => {
            if (res.status === 200) {
              if (res.data === 'refresh') {
                Swal.showValidationMessage('삭제된 방입니다. 다시 홈으로 이동합니다.');
                getRooms();
                return;
              }

              if (res.data === 'fail') {
                Swal.showValidationMessage('비밀번호를 입력해주세요.');
                getRooms();
                return;
              }

              if (res.data === 'already exist') {
                Swal.showValidationMessage('잘못된 접근입니다. 이미 방에 입장한 유저입니다.');
                getRooms();
                return;
              }
              if (res.data === 'password fail') {
                Swal.showValidationMessage('비밀번호가 일치하지 않습니다.');
                getRooms();
                return;
              }
              window.location.href = `${process.env.REACT_APP_DRAWING_URL}/${props.roomId}`;
            } else throw new Error();
          })
          .catch((err) => Swal.showValidationMessage('오류가 발생했습니다.'));
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  };

  return (
    // <button className='focus:ring-2 focus:ring-red-500'>
    <div onClick={onClick} className={' flex flex-col items-center w-full mb-20 cursor-pointer'}>
      <div className='square rounded-3xl h-full w-full bg-bird-pattern bg-cover hover:bg-red-700 hover:opacity-50'></div>
      <div className={'roomTitle pt-4 text-blue-400 font-semibold w-full truncate'}>{props.roomTitle}</div>
      <div className='text-gray-400 w-full font-normal truncate'>{`${props.roomHostname}`}</div>
      {/* <div className={'roomInfo mt-1'}> */}
      {/* <div className={'buttonandImage'}> */}
      {/* <img src='/profile.jpeg' alt=''></img> */}
      {/* </div> */}
      {/* </div> */}
    </div>
    // </button>
  );
}
