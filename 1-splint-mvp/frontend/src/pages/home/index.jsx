import React, { useState, useEffect } from 'react';
import { Route, Link } from 'react-router-dom';

const axios = require('axios');

const Home = () => {
  const [dummy, setDummy] = useState([]);
  
  useEffect(() => { // 방 리스트 가져오기 
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
            <Link to={`/draw/${data.key}`}>
              <div style={{ border: '2px solid', display: 'inline-block' }}>
                Title: {data.title}
                Id: {data.key}
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default Home;
