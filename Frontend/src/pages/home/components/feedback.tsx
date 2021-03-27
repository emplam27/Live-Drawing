import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FeedbackComponentProps, FeedbackForm, ResponseGetFeedbackList } from '../interfaces/feedback-nterfaces';
import './feedback.css';

export function FeedbackComponent(props: FeedbackComponentProps) {
  const [feedbackForm, setFeedbackForm] = useState<FeedbackForm>({ userId: props.userId, text: '' });
  const [feedbackList, setFeedbackList] = useState<FeedbackForm[]>([
    { userId: '1', text: '123' },
    { userId: '2', text: '123' },
    { userId: '3', text: '123' },
  ]);
  useEffect(() => {
    axios.get('http://localhost:8080/feedback').then((res: ResponseGetFeedbackList) => {
      setFeedbackList(res.data);
    });
  }, []);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackForm({ userId: feedbackForm.userId, text: e.target.value });
  };

  const onClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    axios.post('http://localhost:8080/feedback', feedbackForm).then((res) => {
      setFeedbackList([res.data, ...feedbackList]);
    });
  };
  return (
    <div>
      <form>
        <input type='text' onChange={onChange} />
        <button onClick={onClick}>피드백 등록하기</button>
      </form>
      <div className='feedbackBox'>
        {feedbackList.map((feedback, index) => {
          return (
            <div key={index} className='feedback'>
              <p> id : {feedback.userId}</p>
              <hr />
              <p> {feedback.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
