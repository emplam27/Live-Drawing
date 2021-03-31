import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import Draw from './draw';
import { ChatComponent } from './chat/components/chat';

function App() {
  const userId = localStorage.getItem('id');
  // console.log(userId);

  function Drawing() {
    return (
      <>
        <Draw />
        <div className='side'>
          <div className='voice'></div>
          <div className='peers'></div>
          <ChatComponent userId={userId}></ChatComponent>
        </div>
      </>
    );
  }

  return (
    <div className='App'>
      <main className='grid'>
        <Switch>
          <Route exact path='/:roomKey' component={Drawing} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
