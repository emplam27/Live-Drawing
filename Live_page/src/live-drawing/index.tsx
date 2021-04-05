import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Draw from './draw-components';
import ChatComponent from './chat-components';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { RoomInfo, RoomUsers } from './interfaces/socket-interfaces';

import axios from 'axios';
import io from 'socket.io-client';
// import { v4 as uuid } from 'uuid';

import '../App.css';

function LiveDrawing() {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    roomId: roomId,
    userName: null,
    roomTitle: null,
    userId: localStorage.getItem('userId'),
    roomHostId: null,
  });
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [roomUsers, setRoomUsers] = useState<RoomUsers | null>(null);
  const [usersInfo, setUsersInfo] = useState();
  const MySwal = withReactContent(Swal);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/live/${roomId}`, {
        params: { userId: roomInfo.userId },
        headers: headers,
      })
      .then((res) => {
        if (res.status !== 200)
          MySwal.fire({
            title: <p>{'오류가 발생했습니다.'}</p>,
            text: '홈으로 돌아갑니다.',
          }).then(
            () =>
              (window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`),
          );
        setRoomInfo({ ...roomInfo, ...res.data.roomInfo });
        const socketIo = io(`${process.env.REACT_APP_RTC_URL}`, {
          transports: ['websocket'],
        });

        socketIo.emit('join', {
          userName: res.data.roomInfo.userName,
          userId: roomInfo.userId,
          roomId: roomId,
          roomTitle: res.data.roomInfo.roomTitle,
          token: localStorage.getItem('token'),
        });

        socketIo.on('error', (message: { error: string }) => {
          MySwal.fire({
            title: <p>{`${message.error}`}</p>,
            text: '홈으로 돌아갑니다.',
          }).then(
            () =>
              (window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`),
          );
        });

        socketIo.on('roomUsers', (message: RoomUsers) => {
          setRoomUsers(message);
        });

        socketIo.on('connect', () => {
          setSocket(socketIo);
        });
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/live/${roomId}/users`, {
        params: { userId: roomInfo.userId },
        headers: headers,
      })
      .then((res) => {
        setUsersInfo(res.data);
      });
  }, [roomUsers]);

  // useEffect(() => {
  //   const socketIo = io(`${process.env.REACT_APP_RTC_URL}`, {
  //     transports: ['websocket'],
  //   });

  //   socketIo.emit('join', {
  //     userId: roomInfo.userId,
  //     userName: roomInfo.userName,
  //     roomId: roomId,
  //     roomTitle: roomInfo.roomTitle,
  //   });

  //   socketIo.on('error', (message: { error: string }) => {
  //     MySwal.fire({
  //       title: <p>{`${message.error}`}</p>,
  //       text: '홈으로 돌아갑니다.',
  //     }).then(
  //       () => (window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`),
  //     );
  //   });

  //   socketIo.on('update-room-users', (message: RoomUsers) => {
  //     setRoomUsers(message);
  //   });

  //   socketIo.on('connect', () => {
  //     setSocket(socketIo);
  //   });
  // }, []);

  return (
    <>
      <Draw socket={socket} roomInfo={roomInfo} roomUsers={roomUsers} />
      <div className='side'>
        <div className='voice'></div>
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
