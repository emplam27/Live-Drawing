import React from 'react';
import { Route } from 'react-router-dom';
import './App.css';
import { HomeComponent } from './pages/home';
import RoomCreateComponent from './pages/home/components/room-create-form';
import { EntranceComponent } from './pages/home/components/entrance';
import { FeedbackComponent } from './pages/home/components/feedback';
// import { SignInComponent } from './pages/home/components/login-form';
import { JoinComponent } from './pages/home/components/join-form';
import { NavBarComponent } from './pages/home/components/nav';
import { SignInComponent } from './pages/home/components/login-form';
import { RoomListComponent } from './pages/home/components/room-list';

function App() {
  return (
    <div className='App font-apply text-2xl'>
      <main>
        <NavBarComponent></NavBarComponent>
        <div className='p-6'>
          <Route path='/' component={HomeComponent} exact />
          <Route path='/login-form' component={SignInComponent} exact />
          <Route path='/member/sign-up' component={HomeComponent} exact />
          {/* <Route path='/room/:roomKey' render={() => <ChatComponent userId={id} />} exact />s */}
          <Route path='/room' component={RoomCreateComponent} exact />
          <Route path='/mypage' component={HomeComponent} exact />
          {/* <Route path='/login-form' render={() => <SignInComponent ={id} />} exact /> */}
          <Route path='/room/list' component={RoomListComponent} exact />
          <Route path='/user/join-form' component={JoinComponent} exact />
          <Route path='/feedback' component={FeedbackComponent} exact />
        </div>
      </main>
    </div>
  );
}

export default App;
