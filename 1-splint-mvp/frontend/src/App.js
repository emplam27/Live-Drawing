import React from 'react'
import { Link, Route } from 'react-router-dom'
import Home from './pages/home'
import Draw from './pages/draw'
import logo from './logo.svg'
import './App.css'
import CreateRoom from './pages/routes/CreateRoom.jsx'
import Room from './pages/routes/Room.jsx'

function App() {
  return (
    <div className="App">
      <main>
        <div>
          <Route path="/" component={CreateRoom} exact />
          <Route path="/rtc/:roomKey" component={Room} exact />
        </div>
      </main>
    </div>
  )
}

export default App
