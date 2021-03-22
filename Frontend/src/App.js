import React from 'react';
import { Route } from "react-router-dom"

import './App.css';
import HomeComponent from './pages/home';

function App() {
  return (
    <div className='App'>
      <main>
        <div>
          <Route path='/' component={HomeComponent} exact />
          <Route path='/member/sign-in' component={} exact />
          <Route path='/member/sign-up' component={} exact />
          <Route path='/room/:roomKey' component={} exact />
          <Route path='/room' component={} exact />
          <Route path='/mypage' component={} exact />
        </div>
      </main>
    </div>
  );
}

export default App;
