import React, { useEffect, useState } from 'react';
import { LogoutComponent } from './logout-component';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { useCustomDispatch, useCustomState } from '../../../context';
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from 'react-google-login';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import jwt_decode from 'jwt-decode';
import { DecodedToken } from '../interfaces/decoded-token-interface';

export function NavBarComponent() {
  const [isToken, setIsToken] = useState(localStorage.getItem('token'));
  const userState = useCustomState();
  const userDispatch = useCustomDispatch();
  const history = useHistory();
  const MySwal = withReactContent(Swal);

  const config = {
    headers: {
      'Content-Type': 'application/json; charset-utf-8',
    },
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      const decodedToken: DecodedToken = jwt_decode(token);
      userDispatch({ type: 'SET_ID', name: decodedToken.username, token: token });
    }
  }, []);

  const responseGoogle = (res: GoogleLoginResponse | GoogleLoginResponseOffline) => {
    axios.post(`${process.env.REACT_APP_API_URL}/oauth/jwt/google`, JSON.stringify(res), config).then((res) => {
      const decodedToken: DecodedToken = jwt_decode(res.data.Authorization);
      userDispatch({ type: 'SET_ID', name: decodedToken.username, token: res.data.Authorization });
      localStorage.setItem('userId', res.data.userId);
      localStorage.setItem('token', res.data.Authorization);
      if (res.status === 200) {
        MySwal.fire({
          title: <p>로그인 되었습니다.</p>,
          text: '홈으로 돌아갑니다.',
        }).then(() => history.push(''));
      }
    });
  };

  useEffect(() => {
    setIsToken(localStorage.getItem('token'));
  }, [userState]);
  return (
    <div className='header'>
      {/* // <!-- This example requires Tailwind CSS v2.0+ --> */}
      <nav className='nav-bottom'>
        <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
          <div className='relative flex items-center justify-between h-nav'>
            <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>
              {/* <!-- Mobile menu button--> */}
              <button
                type='button'
                className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
                aria-controls='mobile-menu'
                aria-expanded='false'
              >
                <span className='sr-only'>Open main menu</span>
                {/* <!--
            Icon when menu is closed.
            Heroicon name: outline/menu
            Menu open: "hidden", Menu closed: "block"
          --> */}
                <svg
                  className='block h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  {/* <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 6h16M4 12h16M4 18h16' /> */}
                </svg>
                {/* <!--
            Icon when menu is open.
            Heroicon name: outline/x
            Menu open: "block", Menu closed: "hidden"
          --> */}
                <svg
                  className='hidden h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  {/* <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 18L18 6M6 6l12 12' /> */}
                </svg>
              </button>
            </div>
            <div className='flex-1 flex items-center justify-center sm:items-stretch sm:justify-start'>
              <div className='flex-shrink-0 flex items-center text-blue-400 text-3xl font-bold'>
                <Link to='/'>방구석 화방</Link>
                {/* <img className='block lg:hidden h-8 w-auto' src='' alt='방구석 화방' /> */}
                {/* <img className='hidden lg:block h-8 w-auto' src='' alt='방구석 화방' /> */}
              </div>
              <div className='hidden sm:block sm:ml-6'>
                <div className='flex space-x-4'>
                  {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                  {/* <Link
                    to='/'
                    // className='bg-blue-400 text-white px-3 py-2 rounded-md text-md font-medium'
                    className='text-blue-800 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-md font-medium'
                    aria-current='page'
                  >
                    홈
                  </Link> */}

                  <Link
                    to='/room'
                    className='text-gray-400 hover:text-blue-400 hover:text-white px-3 py-2 rounded-md text-md font-bold'
                  >
                    {/* <i className='ri-live-line'></i> */}
                    라이브강의 시작
                  </Link>

                  {/* <Link
                    to='#'
                    className='text-gray-400 hover:text-blue-400 hover:text-white px-3 py-2 rounded-md text-md font-bold'
                  >
                    준비중
                  </Link> */}

                  <Link
                    to='/feedback'
                    className='text-gray-400 hover:text-blue-400 hover:text-white px-3 py-2 rounded-md text-md font-bold'
                  >
                    피드백 남기기
                  </Link>
                </div>
              </div>
            </div>
            <div className='absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0'>
              {isToken ? (
                <>
                  <div className='mr-5'>{`${userState.name}님 환영합니다.`}</div> <LogoutComponent />
                </>
              ) : (
                <GoogleLogin
                  clientId='234586769421-7gqq45aokbu6mn00rbg6gdcbekmd5ert.apps.googleusercontent.com'
                  // buttonText='login'
                  buttonText={'구글로 로그인하기'}
                  // className='w-full h-3/12 shadow-none'
                  // style={{
                  //   border: 'none',
                  // }}
                  render={(renderProps) => (
                    <button
                      onClick={renderProps.onClick}
                      className='py-1 px-3 font-semibold  rounded-lg shadow-md text-white bg-gradient-to-tr from-blue-300 to-blue-400 hover:bg-blue-500'
                    >
                      로그인
                    </button>
                  )}
                  onSuccess={responseGoogle}
                  onFailure={responseGoogle}
                  // className='p-4 m-3 rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white btn-image-google'
                  // cookiePolicy={'single_host_origin'}
                />
              )}
              {/* <button className='bg-gray-800 p-1 rounded-full text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'> */}
              {/* <span className='sr-only'>View notifications</span> */}
              {/* <!-- Heroicon name: outline/bell --> */}
              {/* </button> */}
              {/* <!-- Profile dropdown --> */}
              <div className='ml-3 relative'>
                {/* <div>
                  <button
                    type='button'
                    className='bg-blue-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white'
                    id='user-menu'
                    aria-expanded='false'
                    aria-haspopup='true'
                  >
                    <span className='sr-only'>Open user menu</span>
                  </button>
                </div> */}

                {/* <!--
            Dropdown menu, show/hide based on menu state.
            Entering: "transition ease-out duration-100"
              From: "transform opacity-0 scale-95"
              To: "transform opacity-100 scale-100"
            Leaving: "transition ease-in duration-75"
              From: "transform opacity-100 scale-100"
              To: "transform opacity-0 scale-95"
          --> */}
                {/* <div
                  className='origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none'
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='user-menu'
                >
                  <a href='#' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' role='menuitem'>
                    Your Profile
                  </a>
                  <a href='#' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' role='menuitem'>
                    Settings
                  </a>
                  <a href='#' className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100' role='menuitem'>
                    Sign out
                  </a>
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* <!-- Mobile menu, show/hide based on menu state. --> */}
        <div className='sm:hidden' id='mobile-menu'>
          <div className='px-2 pt-2 pb-3 space-y-1'>
            {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
            <a
              href='#'
              className='bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium'
              aria-current='page'
            >
              홈
            </a>

            <a
              href='#'
              className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            >
              준비중
            </a>

            <a
              href='#'
              className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            >
              준비중
            </a>

            <a
              href='#'
              className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
            >
              피드백 작성하기
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}

{
  /* <svg
                  className='h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                  aria-hidden='true'
                >
                  {/* <path
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                  /> */
}
// </svg> */}
