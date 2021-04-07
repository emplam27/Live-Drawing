import React from 'react';
import { Switch, Route } from 'react-router-dom';
import LiveDrawing from './live-drawing';
import './App.css';

function App() {
  return (
    <div className='App'>
      <main className='flex w-screen h-screen'>
        <Switch>
          <Route path='/live/:roomId' component={LiveDrawing} />
        </Switch>
      </main>
    </div>
  );
}

export default App;