import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useCustomDispatch } from '../../../context';

export function LogoutComponent() {
  const userDispatch = useCustomDispatch();
  const history = useHistory();
  const MySwal = withReactContent(Swal);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    userDispatch({ type: 'SET_ID', name: '', token: '' });
    localStorage.clear();
    MySwal.fire({
      title: <p>로그아웃 되셨습니다.</p>,
    });
    history.push('');
  };
  return (
    <button
      className='my-auto px-3 py-2 h-10 text-lg rounded-lg truncate shadow-md text-white bg-gradient-to-tr from-blue-300 to-blue-400 hover:bg-blue-500'
      onClick={onClick}
    >
      로그아웃
    </button>
  );
}
