import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function RoomCreateComponent() {
  const [values, setValues] = useState({
    member_name: '',
    room_title: '',
  });

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios
      .post('http://localhost:8080/room', values)
      .then((response) => {
        // console.log('VA', values);
        // console.log('RESP', response);
        if (response.status === 200) {
          // console.log(response.data);
          window.location.href = `/room/${response.data['roomKey']}`;
          // console.log(response.data['key']);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <p>라이브방 만들기</p>
      <form onSubmit={submitHandler}>
        <div>
          방주인 : &nbsp;
          <input type='text' name='member_name' value={values.member_name} onChange={changeHandler}></input>
        </div>
        <div>
          방제목 : &nbsp;
          <input type='text' name='room_title' value={values.room_title} onChange={changeHandler}></input>
        </div>
        {/* <Redirect to="/draw/1234"> */}
        <p>
          <button type='submit'>방 만들기</button>
        </p>
        {/* </Redirect> */}
      </form>
    </div>
  );
}
