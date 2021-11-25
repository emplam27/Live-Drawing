import React from 'react';

import { Switch, Route } from 'react-router-dom';
import LiveDrawingComponent from './live-drawing/LiveDrawingComponent';
import './App.css';

function App() {
  return (
    <div className='App'>
      <main className='flex w-screen h-screen select-none'>
        <Switch>
          <Route path='/live/:roomId' component={LiveDrawingComponent} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
