import React from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import { HomeComponent } from './pages/home';
import RoomCreateComponent from './pages/home/components/room-create-form';
import { FeedbackComponent } from './pages/home/components/feedback';
import { JoinComponent } from './pages/home/components/join-form';
import { NavBarComponent } from './pages/home/components/nav';
import { SignInComponent } from './pages/home/components/login-form';
import { useMediaQuery } from 'react-responsive';
import BanComponent from './pages/home/components/mobile-ban';

function App() {
  const mobileNotAllowed = useMediaQuery({
    query: `all and (min-width:768px)`,
  });
  return (
    <div className='App font-apply text-2xl'>
      <main>
        {!mobileNotAllowed && <BanComponent></BanComponent>}
        {mobileNotAllowed && <NavBarComponent></NavBarComponent>}
        <div>
          {mobileNotAllowed && <Route path='/' component={HomeComponent} exact />}
          {mobileNotAllowed && <Route path='/login-form' component={SignInComponent} exact />}
          {mobileNotAllowed && <Route path='/room' component={RoomCreateComponent} exact />}
          {mobileNotAllowed && <Route path='/mypage' component={HomeComponent} exact />}
          {mobileNotAllowed && <Route path='/user/join-form' component={JoinComponent} exact />}
          {mobileNotAllowed && <Route path='/feedback' component={FeedbackComponent} exact />}
        </div>
      </main>
    </div>
  );
}

export default App;
