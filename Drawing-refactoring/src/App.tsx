import React, { useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import './App.css';
import Draw from './draw';
import { ChatComponent } from './chat/components/chat';
import axios from 'axios';
import { Data, ResponseData } from './interfaces/app-interfaces';
import { RoomData } from './chat/interfaces/room-data';

function App() {
  const [data, setData] = useState<Data>({
    roomKey: '',
    userName: '',
    roomTitle: '',
    userKey: '',
  });
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [roomData, setRoomData] = useState<RoomData>();

  axios.get(`${process.env.REACT_APP_API_URL}`).then((res: ResponseData) => {
    setData(res.data);
    useEffect(() => {
      const socketIo = io(`${process.env.REACT_APP_HOMEPAGE5_URL}`, {
        transports: ['websocket'],
      });

      socketIo.emit('join', {
        userId: res.data.userName,
        room: res.data.roomKey,
      });

      socketIo.on('roomData', (message: RoomData) => {
        setRoomData(message);
      });

      socketIo.on('connect', () => {
        setSocket(socketIo);
      });
    }, []);
  });

  function Drawing() {
    return (
      <>
        <Draw socket={socket} roomKey={data.roomKey} />
        <div className='side'>
          <div className='voice'></div>
          <div className='peers'></div>
          <ChatComponent
            userName={data.userName}
            socket={socket}
          ></ChatComponent>
        </div>
      </>
    );
  }

  return (
    <div className='App'>
      <main className='grid'>
        <Switch>
          <Route path='/live/:roomKey' component={Drawing} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
