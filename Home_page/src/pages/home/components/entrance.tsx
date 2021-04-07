import axios from 'axios';
import React, { useState, useEffect } from 'react';
import './room-list.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { EntranceProps } from '../interfaces/entrance-props-interface';
import { useCustomState } from '../../../context';

export function EntranceComponent(props: EntranceProps) {
  const MySwal = withReactContent(Swal);
  const userState = useCustomState();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserId(localStorage.getItem('userId'));
  }, [userState]);

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
      },
      showCancelButton: true,
      preConfirm: (password) => {
        const values = { userId: userId, password: password, roomId: props.roomId };
        return axios
          .post(`${process.env.REACT_APP_API_URL}/room/entrance/`, values, { headers: headers })
          .then((res) => {
            if (res.status === 200) {
              if (res.data === 'already exist') {
                Swal.showValidationMessage('잘못된 접근입니다. 이미 방에 입장한 유저입니다.');
                return;
              }
              if (res.data === 'password fail') {
                Swal.showValidationMessage('비밀번호가 일치하지 않습니다.');
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
    <div onClick={onClick} className={'roomMetadata'}>
      <div className={'roomMetadata'}>
        <div className={'roomImage'}>
          <img src='/Kakao_drawing.jpeg' alt=''></img>
        </div>
        <div className={'roomInfo'}>
          <div className='roomTitle'>{props.roomTitle}</div>
          <div className={'buttonandImage'}>
            <img src='/profile.jpeg' alt=''></img>
            <div className={'name'}>{`${props.roomHostname}`}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
