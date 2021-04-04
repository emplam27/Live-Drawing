import React, { useState, useEffect } from 'react';
import { Switch, Route, useParams } from 'react-router-dom';
import './App.css';
import Draw from './draw';
import { ChatComponent } from './chat/components/chat';
import axios from 'axios';
import { Data, ResponseData } from './interfaces/app-interfaces';
import { RoomData } from './chat/interfaces/room-data';
import io from 'socket.io-client';
import { v4 as uuid } from 'uuid';

function App() {
  function Drawing() {
    const tempName = uuid();
    const { roomId } = useParams<{ roomId: string }>();
    const [data, setData] = useState<Data>({
      roomId: 'roomId',
      userName: tempName,
      roomTitle: '7번방',
      userId: tempName,
      hostId: tempName,
    });
    const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
    const [roomData, setRoomData] = useState<RoomData | null>(null);

    // axios.get(`${process.env.REACT_APP_API_URL}`).then((res: ResponseData) => {
    //   setData(res.data);
    //   useEffect(() => {
    //     const socketIo = io(`${process.env.REACT_APP_HOMEPAGE5_URL}`, {
    //       transports: ['websocket'],
    //     });

    //     socketIo.emit('join', {
    //       userId: res.data.userName,
    //       room: res.data.roomId,
    //     });

    //     socketIo.on('roomData', (message: RoomData) => {
    //       setRoomData(message);
    //     });

    //     socketIo.on('connect', () => {
    //       setSocket(socketIo);
    //     });
    //   }, []);
    // });

    useEffect(() => {
      const socketIo = io(`${process.env.REACT_APP_RTC_URL}`, {
        transports: ['websocket'],
      });

      socketIo.emit('join', {
        userId: data.userId,
        userName: data.userName,
        roomId: roomId,
      });

      socketIo.on('roomData', (message: RoomData) => {
        setRoomData(message);
        console.log('-------roomdata------', message);
      });

      socketIo.on('connect', () => {
        setSocket(socketIo);
      });
    }, []);

    return (
      <>
        <Draw socket={socket} data={data} roomData={roomData} />
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
          <Route path='/live/:roomId' component={Drawing} />
        </Switch>
      </main>
    </div>
  );
}

export default App;
