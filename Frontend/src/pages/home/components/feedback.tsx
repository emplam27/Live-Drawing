import axios from 'axios';
import React, { useState } from 'react';
import { FeedbackComponentProps, FeedbackForm } from '../interfaces/feedback-nterfaces';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2';
import { useHistory } from 'react-router';

export function FeedbackComponent(props: FeedbackComponentProps) {
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({ userName: props.userName, text: '' });
  const MySwal = withReactContent(Swal);
  const history = useHistory();

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeedbackForm({ userName: feedbackForm.userName, text: e.target.value });
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/feedback`, feedbackForm).then((res) => {
      if (res.data === 'success')
        MySwal.fire({
          title: <p>피드백 등록이 완료되었습니다. 감사합니다.</p>,
          text: '홈으로 돌아갑니다.',
        }).then(() => history.push(''));
      else
        MySwal.fire({
          title: <p>피드백 등록이 실패했습니다.</p>,
          text: '다시 시도해주세요.',
        });
    });
  };
  return (
    <div>
      <div className='w-full flex justify-center items-center bg-gradient-to-tr from-blue-200 to-blue-0 h-mainBox'>
        {/* <div className='bg-image w-full sm:w-1/2 md:w-9/12 lg:w-1/2 mx-3 md:mx-5 lg:mx-0 shadow-md flex flex-col md:flex-row items-center rounded z-10 overflow-hidden bg-center bg-cover bg-blue-600'> */}
        <div className=' w-full sm:w-1/2 md:w-9/12 lg:w-1/2 mx-3 md:mx-5 lg:mx-0 shadow-md flex flex-col md:flex-row items-center rounded z-10 overflow-hidden bg-center bg-cover bg-blue-600'>
          {/* <div className='w-full md:w-1/2 flex flex-col justify-center items-center bg-opacity-25 bg-blue-600 backdrop'>
            <h1 className='text-3xl md:text-4xl font-extrabold text-white my-2 md:my-0'>방구석 화방</h1>
            <p className='mb-2 text-white text-xl hidden md:block'>당신도 화가가 될 수 있습니다.</p>
          </div> */}
          <div className='w-full  flex flex-col items-center bg-white py-5 md:py-8 px-4'>
            <h3 className='mb-4 font-bold text-3xl flex items-center text-blue-500'>피드백을 작성해주세요.</h3>
            <form action='#' className='px-3 flex flex-col justify-center items-center w-full gap-3'>
              <textarea
                onChange={onChange}
                placeholder='피드백을 작성하세요.'
                className='px-4 py-2 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
              />
              <button
                onClick={onClick}
                className='flex m-3 justify-center items-center bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold focus:outline-none focus:ring rounded px-3 py-1'
              >
                피드백 등록하기
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
