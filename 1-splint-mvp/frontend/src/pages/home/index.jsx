import React, { useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';

const axios = require('axios');

const Home = () => {
  const [dummy, setDummy] = useState([]);
  
  useEffect(() => {
    axios.get('http://localhost:8080')
      .then((res) => {
        setDummy(res.data)
      });
  }, [])

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
