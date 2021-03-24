import React from 'react';
import { Route } from 'react-router-dom';

import './App.css';
import HomeComponent from './pages/home';
import { ChatComponent } from './pages/live-room/components/chat';

const uuid = require('uuid');

function App() {
  const id = uuid.v4();
  return (
    <div className='App'>
      <main>
        <div>
          <Route path='/' component={HomeComponent} exact />
          {/* <Route path='/member/sign-in' component={} exact /> */}
          {/* <Route path='/member/sign-up' component={} exact /> */}
          <Route path='/room/:roomKey' render={() => <ChatComponent userId={id} />} exact />
          {/* <Route path='/room' component={} exact /> */}
          {/* <Route path='/mypage' component={} exact /> */}
        </div>
      </main>
    </div>
  );
}

export default App;
