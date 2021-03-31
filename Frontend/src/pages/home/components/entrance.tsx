import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './room-list.css';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { EntranceProps, Values } from '../interfaces/entrance-props-interface';
import { useCustomState } from '../../../context';

export function EntranceComponent(props: EntranceProps) {
  const MySwal = withReactContent(Swal);
  const userState = useCustomState();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userName, setUserName] = useState(localStorage.getItem('id'));
  const history = useHistory();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserName(localStorage.getItem('id'));
  }, [userState]);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };

  const onClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    console.log('00000000000000000000hi', userName);
    if (token === '') return;
    MySwal.fire({
      title: '비밀번호를 입력하세요.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      preConfirm: (password) => {
        const values = { username: userName, password: password, roomKey: props.roomKey, roomPk: props.roomPk };
        console.log('-------------->', values);
        return axios
          .post('http://localhost:8080/api/room/entrance/', values, { headers: headers })
          .then((res) => {
            if (res.data === 'success') history.push(`/room/${props.roomKey}`);
            else throw new Error();
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

    //  <Link to={`/room/${roomKey}`}>
    //     <div className='entrance'>
    //       <h3>{room_title}</h3>
    //       {/* <h4>방주인 : {room_host}</h4> */}
    //     </div>
    //     {/* //{' '} */}
    //   </Link>
  );
}
