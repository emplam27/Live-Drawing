import React from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import Draw from './pages/draw';
import { ChatComponent } from './chat/components/chat';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const tempId = uuidv4();

  return (
    <div className='App'>
      <main className='grid'>
        <Switch>
          <Route exact path='/draw/:roomKey' component={Draw} />
        </Switch>
        <div className='side'>
          <div className='voice'></div>
          <ChatComponent userId={tempId}></ChatComponent>
        </div>
      </main>
    </div>
  );
}

export default App;
