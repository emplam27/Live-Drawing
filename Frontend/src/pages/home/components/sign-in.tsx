import React from 'react';
import axios from 'axios';

export function SignInComponent() {
  //   const onClick = () => {
  //     axios.post('http://localhost:8080/room', {});
  //   };
  return (
    <div>
      <body>
        <h1>회원가입 페이지</h1>
        <hr />
        {/* 시큐리티는 x-www-form-url-encoded 타입만 인식 */}
        <form action='/join' method='POST'>
          <input type='text' name='username' placeholder='Username' /> <br />
          <input type='password' name='password' placeholder='Password' />
          <br />
          <input type='email' name='email' placeholder='Email' />
          <br />
          <button type='submit'>회원가입</button>
        </form>
      </body>
    </div>
  );
}
