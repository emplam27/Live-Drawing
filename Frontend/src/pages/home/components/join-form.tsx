import React, { useState, useEffect } from 'react';
import withReactContent from 'sweetalert2-react-content';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router';

export function JoinComponent() {
  const [password1, setPassword1] = useState<string>('');
  const [password2, setPassword2] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [classFlag1, setClassFlag1] = useState<string>('text-red-700');
  const [classFlag2, setClassFlag2] = useState<string>('text-red-700');
  const [textFlag1, setTextFlag1] = useState<string>('비밀번호가 일치하지 않습니다.');
  const [textFlag2, setTextFlag2] = useState<string>('적어도 8자 이상의 비밀번호를 입력하세요.');
  const [buttonFlag, setButtonFlag] = useState<boolean>(true);
  const MySwal = withReactContent(Swal);
  const history = useHistory();

  const onChangePassword1 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword1(e.target.value);
  };
  const onChangePassword2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword2(e.target.value);
  };
  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    if (password1 === password2 && password1.length > 0) {
      setClassFlag1('text-green-700');
      setTextFlag1('비밀번호가 일치합니다.');
    } else if (password1 != password2) {
      setClassFlag1('text-red-700');
      setTextFlag1('비밀번호가 일치하지 않습니다.');
    } else {
      setClassFlag1('transparent');
      setTextFlag1('');
    }
    if (password1.length > 7 && password2.length > 7) {
      setClassFlag2('text-green-700');
      setTextFlag2('최소 글자수를 채웠습니다.');
    } else if (password1.length === 0 && password2.length === 0) {
      setClassFlag2('transparent');
      setTextFlag2('');
    } else {
      setClassFlag2('text-red-700');
      setTextFlag2('적어도 8자 이상의 비밀번호를 입력하세요.');
    }
  }, [password1, password2]);

  useEffect(() => {
    if (classFlag1 === 'text-green-700' && classFlag2 === 'text-green-700') setButtonFlag(false);
    else setButtonFlag(true);
  }, [classFlag1, classFlag2]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    axios
      .post('http://localhost:8080/user/join', { username: userName, email: email, password: password1 })
      .then((res) => {
        if (res.data === 'success')
          MySwal.fire({
            title: <p>회원가입이 되었습니다.</p>,
            text: '홈으로 돌아갑니다.',
          }).then(() => history.push(''));
        else
          MySwal.fire({
            title: <p>회원가입에 실패했습니다.</p>,
            text: '다시 시도한 후에도 실패하면 피드백을 남겨주세요.',
          });
      });
  };
  return (
    <div>
      <div className='w-full flex justify-center items-center bg-gradient-to-tr from-blue-200 to-blue-0 h-mainBox'>
        <div className='bg-image w-full sm:w-1/2 md:w-9/12 lg:w-1/2 mx-3 md:mx-5 lg:mx-0 shadow-md flex flex-col md:flex-row items-center rounded z-10 overflow-hidden bg-center bg-cover bg-blue-600'>
          <div className='w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-25 bg-blue-600 backdrop p-1'>
            <h1 className='text-3xl md:text-4xl font-extrabold text-white my-2 md:my-0'>방구석 화방</h1>
            <p className='mb-2 text-white text-xl hidden md:block'>당신도 화가가 될 수 있습니다.</p>
          </div>
          <div className='w-full md:w-1/2 flex flex-col items-center bg-white py-5 md:py-8 px-4'>
            <h3 className='mb-4 font-bold text-3xl flex items-center text-blue-500'>회원가입</h3>
            <form action='#' className='px-3 flex flex-col justify-center items-center w-full gap-3'>
              <input
                type='text'
                placeholder='이름을 입력하세요.'
                onChange={onChangeUserName}
                className='px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <input
                type='email'
                placeholder='이메일을 입력하세요.'
                onChange={onChangeEmail}
                className='px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <input
                type='password'
                placeholder='비밀번호를 입력하세요.'
                onChange={onChangePassword1}
                className='px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <input
                type='password'
                onChange={onChangePassword2}
                placeholder='비밀번호를 다시 입력하세요.'
                className='px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <div className=''>
                <div className={`${classFlag1} font-normal text-sm text-left`}>{textFlag1}</div>
                <div className={`${classFlag2} font-normal text-sm text-left`}>{textFlag2}</div>
              </div>
              <button
                onClick={onClick}
                disabled={buttonFlag}
                className='flex m-3 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold focus:outline-none focus:ring rounded px-3 py-1'
              >
                회원가입 하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
