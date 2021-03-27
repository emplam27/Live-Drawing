import React, { useState } from 'react';
import { Switch, Link, Route } from 'react-router-dom';
import './App.css';
import Draw from './pages/draw';
import { ChatComponent } from './chat/components/chat';
import { v4 as uuidv4 } from 'uuid';
import { ActiveLayerProvider } from './pages/draw/DrawContext';

interface Layer {
  name: string;
  canvasId: string;
  buttonId: string;
  canvasCtx: CanvasRenderingContext2D | null;
}

function App() {
  const tempId = uuidv4();

  return (
    <div className='App'>
      <main className='grid'>
        <ActiveLayerProvider>
          <Switch>
            <Route exact path='/draw/:roomKey' component={Draw} />
          </Switch>
        </ActiveLayerProvider>
        <div className='side'>
          <div className='voice'></div>
          <ChatComponent userId={tempId}></ChatComponent>
        </div>
      </main>
    </div>
  );
}

export default App;
