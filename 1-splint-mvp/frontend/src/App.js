import React from 'react';
import { Link, Route } from 'react-router-dom';
import Home from './pages/home';
import Draw from './pages/draw';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className='App'>
      <main>
        <div>
          <Route path='/' component={Home} exact />
          <Route path='/draw' component={Draw} exact />
        </div>
      </main>
    </div>
  );
}

export default App;
