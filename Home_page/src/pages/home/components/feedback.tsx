import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FeedbackForm } from '../interfaces/feedback-nterfaces';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router';
import { useCustomState } from '../../../context';
export function FeedbackComponent() {
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({
    userId: localStorage.getItem('userId'),
    text: '',
  });
  const MySwal = withReactContent(Swal);
  const userState = useCustomState;
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [textLength, setTextLength] = useState<number>(0);
  const history = useHistory();
  const headers = {
    'Content-Type': 'application/json',
    Authorization: token,
  };
  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setUserId(localStorage.getItem('userId'));
  }, [userState]);
  useEffect(() => {
    setTextLength(feedbackForm.text.length);
  }, [feedbackForm]);
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (feedbackForm.text.length <= 1000) {
      setFeedbackForm({ userId: userId, text: e.target.value });
    } else
      MySwal.fire({
        title: <p>허용 글자수를 초과했습니다.</p>,
        text: '허용 글자수 : 1000자',
      });
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
      .post(`${process.env.REACT_APP_API_URL}/feedback`, feedbackForm, { headers: headers })
      .then((response) => {
        if (response.status === 200)
          MySwal.fire({
            title: <p>피드백 등록이 완료되었습니다. 감사합니다.</p>,
            text: '홈으로 돌아갑니다.',
          }).then(() => history.push(''));
      })
      .catch(() =>
        MySwal.fire({
          title: <p>피드백 등록이 실패했습니다.</p>,
          text: '다시 시도해주세요.',
        }),
      );
  };
  return (
    <div>
      <div className='w-full flex justify-center items-center  h-mainBox'>
        <div className='bg-image w-full sm:w-1/2 md:w-9/12 lg:w-4/6 lg:h-2/3 mx-3 md:mx-5 lg:mx-0 shadow-md flex flex-col md:flex-row items-center rounded z-10 overflow-hidden bg-center bg-cover bg-blue-600'>
          <div className='w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-25 bg-blue-600 backdrop p-1'>
            <h1 className='text-3xl md:text-4xl font-extrabold text-white my-2 md:my-0'>방구석 화방</h1>
            <p className='mb-2 text-white text-xl hidden md:block'>당신도 화가가 될 수 있습니다.</p>
          </div>
          <div className='w-full md:w-1/2 h-full flex flex-col items-center bg-white md:py-8 px-4'>
            <h3 className='mb-5 mt-3 font-bold text-4xl flex items-center text-blue-400'>피드백 남기기</h3>
            <form action='#' className='px-3 flex h-full flex-col justify-center items-center w-full gap-2'>
              <textarea
                onChange={onChange}
                placeholder='피드백을 작성해주세요.'
                className='px-4 pt-2 w-10/12 h-32 rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
                maxLength={1000}
              />
<<<<<<< HEAD
              <p className='text-gray-500 Length text-base text-sm'>{textLength} / 1000</p>
=======
              <div className='text-gray-500 Length text-base '>{textLength} / 1000</div>
>>>>>>> 57f2322a09a93c0925b8e13f6f559c9a931d945d
              <button
                onClick={onClick}
                className='w-10/12 h-14 mt-1 p5-20 font-semibold  rounded-lg shadow-md text-white bg-gradient-to-tr from-blue-300 to-blue-400 hover:bg-blue-500'
              >
                감사합니다 :)
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
