import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import { useCustomDispatch, useCustomState } from '../../../context';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

export function SignInComponent() {
  const [email, setEmail] = useState<string>();
  const [password, setPassWord] = useState<string>();
  const userState = useCustomState();
  const userDispatch = useCustomDispatch();
  const history = useHistory();
  const MySwal = withReactContent(Swal);

  const config = {
    headers: {
      'Content-Type': 'application/json; charset-utf-8',
    },
  }; //! 서버에 token 넘겨줄때는 header로 넘겨준다.

  const responseGoogle = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    axios.post(`${process.env.REACT_APP_API_URL}/oauth/jwt/google`, JSON.stringify(res), config).then((res) => {
      userDispatch({ type: 'SET_ID', name: res.data.username, token: res.data.Authorization });
      localStorage.setItem('name', res.data.username);
      localStorage.setItem('token', res.data.Authorization);
      if (res.data.Authorization) {
        MySwal.fire({
          title: <p>로그인 되었습니다.</p>,
          text: '홈으로 돌아갑니다.',
        }).then(() => history.push(''));
      }
    });
  };

  const onChangeUserId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassWord(e.target.value);
  };
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/login`, { email: email, pasword: password }).then((res) => {
      userDispatch({ type: 'SET_ID', name: res.data.username, token: res.data.Authorization });
      localStorage.setItem('name', res.data.username);
      localStorage.setItem('token', res.data.Authorization);
      if (res.data.Authorization) {
        MySwal.fire({
          title: <p>로그인 되었습니다.</p>,
          text: '홈으로 돌아갑니다.',
        }).then(() => history.push('/'));
      }
    });
  };

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
      <div className='w-full flex justify-center items-center  h-mainBox'>
        <div className='bg-image w-full sm:w-1/2 md:w-9/12 lg:w-4/6 lg:h-2/3 mx-3 md:mx-5 lg:mx-0 shadow-md flex flex-col md:flex-row items-center rounded z-10 overflow-hidden bg-center bg-cover bg-blue-600'>
          <div className='w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-25 bg-blue-600 backdrop p-1'>
            <h1 className='text-3xl md:text-4xl font-extrabold text-white my-2 md:my-0'>방구석 화방</h1>
            <p className='mb-2 text-white text-xl hidden md:block'>당신도 화가가 될 수 있습니다.</p>
          </div>
          <div className='w-full md:w-1/2 h-full flex flex-col items-center bg-white py-5 md:py-8 px-4'>
            <h3 className='mb-4 py-15 font-bold text-4xl py-10 flex items-center text-blue-400'>로그인</h3>
            <form action='#' className='px-3 py-2 flex flex-col justify-center items-center w-full gap-3'>
              <input
                type='email'
                onChange={onChangeUserId}
                placeholder='이메일..'
                className='px-4 h-12 w-7/12 rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <input
                type='password'
                name='password'
                onChange={onChangePassword}
                placeholder='비밀번호..'
                className='px-4 h-12 w-7/12 py-0 rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <div className='items-center w-7/12 pt-15'>
                {/* <button className='p-4 m-3 rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white btn-image-google'></button> */}
                {/* <button className='p-4 m-3 rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white btn-image-facebook'></button> */}
                {/* <button className='p-4 m-3 rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white btn-image-naver'></button> */}
                <button
                  onClick={onClick}
                  className='w-full h-12 p5-20font-semibold  rounded-lg shadow-md text-white bg-gradient-to-tr from-blue-300 to-blue-400 hover:bg-blue-500'
                >
                  로그인
                </button>
              </div>
              <GoogleLogin
                clientId='234586769421-7gqq45aokbu6mn00rbg6gdcbekmd5ert.apps.googleusercontent.com'
                // buttonText='login'
                className='h-12 w-7/12'
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
                // className='p-4 m-3 rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white btn-image-google'
                // cookiePolicy={'single_host_origin'}
              />
            </form>
            {/* <p className='text-gray-700 text-sm mt-2 mr-1'>
              회원가입이 필요하십니까?
              <Link
                to='/user/join-form'
                className='text-blue-500 hover:text-green-600 mt-3 ml-1 focus:outline-none font-bold underline'
              >
                가입하기
              </Link>
            </p> */}
          </div>
        </div>
      </div>
    </div>
  );
}
