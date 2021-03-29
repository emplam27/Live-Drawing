import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export function SignInComponent() {
  const [userId, setUserId] = useState<string>();
  const [password, setPassWord] = useState<string>();

  const onChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value);
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassWord(e.target.value);
  };
  // const onClick = () => {
  //   axios.post('http://localhost:8080/login', { userId: userId, password: password }).then((res) => {});
  // };

  //   return (
  //     <div>
  //       <h1>로그인 페이지</h1>
  //       <hr />
  //       {/* 시큐리티는 x-www-form-url-encoded 타입만 인식 */}
  //       <form action='/login' method='POST'>
  //         <input type='text' name='username' placeholder='Username' onChange={onChangeUserName} /> <br />
  //         <input type='password' name='password' placeholder='Password' onChange={onChangePassword} />
  //         <br />
  //         {/* <button onClick={onClick}>로그인</button> */}
  //       </form>
  //       <a href='http://localhost:8080/oauth2/authorization/google'>구글 로그인</a>
  //       <a href='http://localhost:8080/oauth2/authorization/facebook'>페이스북 로그인</a>
  //       <a href='http://localhost:8080/oauth2/authorization/naver'>네이버 로그인</a>
  //       <a href='/user/join-form'>회원가입을 아직 하지 않으셨나요?</a>
  //     </div>
  //   );
  // }

  return (
    <div>
      <div className='w-full flex justify-center items-center bg-gradient-to-tr from-blue-200 to-blue-0 h-mainBox'>
        <div className='bg-image w-full sm:w-1/2 md:w-9/12 lg:w-1/2 mx-3 md:mx-5 lg:mx-0 shadow-md flex flex-col md:flex-row items-center rounded z-10 overflow-hidden bg-center bg-cover bg-blue-600'>
          <div className='w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-25 bg-blue-600 backdrop'>
            <h1 className='text-3xl md:text-4xl font-extrabold text-white my-2 md:my-0'>방구석 화방</h1>
            <p className='mb-2 text-white text-xl hidden md:block'>당신도 화가가 될 수 있습니다.</p>
          </div>
          <div className='w-full md:w-1/2 flex flex-col items-center bg-white py-5 md:py-8 px-4'>
            <h3 className='mb-4 font-bold text-3xl flex items-center text-blue-500'>LOGIN</h3>
            <form action='#' className='px-3 flex flex-col justify-center items-center w-full gap-3'>
              <input
                type='email'
                onChange={onChangeUserId}
                placeholder='이메일..'
                className='px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <input
                type='password'
                onChange={onChangePassword}
                placeholder='비밀번호..'
                className='px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <div className='flex justify-between'>
                <a href='http://localhost:8080/oauth2/authorization/google'>
                  <button className='p-4 m-3 rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white btn-image-google'></button>
                </a>
                <a href='http://localhost:8080/oauth2/authorization/facebook'>
                  <button className='p-4 m-3 rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white btn-image-facebook'></button>
                </a>
                <a href='http://localhost:8080/oauth2/authorization/naver'>
                  <button className='p-4 m-3 rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white btn-image-naver'></button>
                </a>
                <button className='flex m-3 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold focus:outline-none focus:ring rounded px-3 py-1'>
                  {/* <svg
                  className='w-5 h-5 inline'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                ></svg> */}
                  로그인
                </button>
              </div>
            </form>
            <p className='text-gray-700 text-sm mt-2 mr-1'>
              회원가입이 필요하십니까?
              <Link
                to='/user/join-form'
                className='text-blue-500 hover:text-green-600 mt-3 ml-1 focus:outline-none font-bold underline'
              >
                가입하기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
