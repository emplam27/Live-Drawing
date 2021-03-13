import React from 'react';

const dummy = [
  {
    title: '홍지의 그림방',
    id: 1,
  },
  {
    title: '유석이의 그림방',
    id: 2,
  },
];
const Home = () => {
  return (
    <div>
      <p>Home component</p>
      {dummy.map((data, index) => {
        return (
          <div key={index}>
            <div>Title: {data.title}</div>
            <div>Id: {data.id}</div>
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default Home;
