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
  const [userName, setUserName] = useState(localStorage.getItem('name'));
  // console.log(userName, token);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserName(localStorage.getItem('name'));
  }, [userState]);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    if (token === null || userName === null) {
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
        const values = { username: userName, password: password, roomKey: props.roomKey, roomPk: props.roomPk };
        return axios
          .post(`${process.env.REACT_APP_API_URL}/room/entrance/`, values, { headers: headers })
          .then((res) => {
            if (res.status === 200) {
              window.location.href = `${process.env.REACT_APP_DRAWING_URL}/room/${props.roomKey}`;
            } else throw new Error();
          })
          .catch((err) => Swal.showValidationMessage('비밀번호가 일치하지 않습니다.'));
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
            <div className={'name'}>전민동고흐</div>
          </div>
        </div>
      </div>
    </div>
  );
}
