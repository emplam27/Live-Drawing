import React from 'react';
import { Switch, Route } from 'react-router-dom';
// import logo from './logo.svg';
import Draw from './pages/draw';
import './App.css';

function App() {
  return (
    <div className='App'>
      <main>
        <Switch>
          <Route exact path='/draw/:roomKey' component={Draw} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
