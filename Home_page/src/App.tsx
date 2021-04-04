import React from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import { HomeComponent } from './pages/home';
import RoomCreateComponent from './pages/home/components/room-create-form';
import { FeedbackComponent } from './pages/home/components/feedback';
import { JoinComponent } from './pages/home/components/join-form';
import { NavBarComponent } from './pages/home/components/nav';
import { SignInComponent } from './pages/home/components/login-form';

function App() {
  return (
    <div className='App font-apply text-2xl'>
      <main>
        <NavBarComponent></NavBarComponent>
        <div>
          <Route path='/' component={HomeComponent} exact />
          <Route path='/login-form' component={SignInComponent} exact />
          <Route path='/room' component={RoomCreateComponent} exact />
          <Route path='/mypage' component={HomeComponent} exact />
          <Route path='/user/join-form' component={JoinComponent} exact />
          <Route path='/feedback' component={FeedbackComponent} exact />
        </div>
      </main>
    </div>
  );
}

export default App;
