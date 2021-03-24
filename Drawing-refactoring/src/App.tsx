import React from 'react';
import { Switch, Link, Route } from 'react-router-dom';
import logo from './logo.svg';
import Draw from './pages/draw';
import './App.css';
import { ChatComponent } from './chat/components/chat';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const tempId = uuidv4();

  return (
    <div className='App'>
      <main className='grid'>
        <Draw></Draw>
        <div className='side'>
          <div className='voice'></div>
          <ChatComponent userId={tempId}></ChatComponent>
        </div>
      </main>
    </div>
  );
}

export default App;
