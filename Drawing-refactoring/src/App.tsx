import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import Draw from './pages/draw';
import { ChatComponent } from './chat/components/chat';

function App() {
  const userId = localStorage.getItem('id');
  console.log(userId);

  return (
    <div className='App'>
      <main className='grid'>
        <Switch>
          <Route exact path='/draw/:roomKey' component={Draw} />
        </Switch>
        <div className='side'>
          <div className='voice'></div>
          <div className='peers'></div>
          <ChatComponent userId={userId}></ChatComponent>
        </div>
      </main>
    </div>
  );
}

export default App;
