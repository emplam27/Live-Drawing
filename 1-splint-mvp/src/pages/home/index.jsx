import React from 'react';
import { Route, Link } from 'react-router-dom';

const axios = require('axios');

// const dummy = axios.get('/');
const dummy = axios.get('localhost:8080/');
const Home = () => {
  return (
    <div>
      <p>Home component</p>
      {dummy.map((data, index) => {
        return (
          // <Link to='/'>Home</Link>
          <div key={index} style={{ margin_bottom: '20px' }}>
            <Link to='/draw'>
              <div style={{ border: '2px solid', display: 'inline-block' }}>
                Title: {data.title}
                Id: {data.roomId}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
