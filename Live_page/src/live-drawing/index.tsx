import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Draw from './draw-components';
import ChatComponent from './chat-components';
import VoiceChatComponent from './voice-components';

import {
  RoomInfo,
  ResponseData,
  RoomUsers,
} from './interfaces/socket-interfaces';

// import axios from 'axios';
import io from 'socket.io-client';
import { v4 as uuid } from 'uuid';

import '../App.css';

function LiveDrawing() {
  const tempName = uuid();
  const { roomId } = useParams<{ roomId: string }>();
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    roomId: 'roomId',
    userName: tempName,
    roomTitle: '7번방',
    userId: tempName,
    hostId: tempName,
  });
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [roomUsers, setRoomUsers] = useState<RoomUsers | null>(null);

  // axios.get(`${process.env.REACT_APP_API_URL}`).then((res: ResponseData) => {
  //   setData(res.data);
  //   useEffect(() => {
  //     const socketIo = io(`${process.env.REACT_APP_RTC_URL}`, {
  //       transports: ['websocket'],
  //     });

  //     socketIo.emit('join', {
  //       userId: res.data.userName,
  //       room: res.data.roomId,
  //     });

  //     socketIo.on('roomUsers', (message: RoomUsers) => {
  //       setRoomUsers(message);
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
      userId: roomInfo.userId,
      userName: roomInfo.userName,
      roomId: roomId,
    });

    socketIo.on('update-room-users', (message: RoomUsers) => {
      setRoomUsers(message);
    });

    socketIo.on('connect', () => {
      setSocket(socketIo);
    });
  }, []);

  return (
    <>
      <Draw socket={socket} roomInfo={roomInfo} roomUsers={roomUsers} />
      <div className='side'>
        <div className='voice'>
          <VoiceChatComponent></VoiceChatComponent>
        </div>
        <div className='peers'></div>
        <ChatComponent
          userName={roomInfo.userName}
          socket={socket}
        ></ChatComponent>
      </div>
    </>
  );
}

export default LiveDrawing;
