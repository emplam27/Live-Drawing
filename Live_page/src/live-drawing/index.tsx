import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import SidebarComponent from './sidebar-components';
import DrawComponent from './draw-components';
import ChatComponent from './chat-components';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { RoomInfo, RoomUsers, UsersInfo } from './interfaces/socket-interfaces';
import { Layer } from './interfaces/draw-components-interfaces';

import axios from 'axios';
import io from 'socket.io-client';
// import { v4 as uuid } from 'uuid';

import '../App.css';

function LiveDrawing() {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    roomId: roomId,
    username: null,
    roomTitle: null,
    userId: localStorage.getItem('userId'),
    roomHostId: null,
  });
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const [roomUsers, setRoomUsers] = useState<RoomUsers | null>(null);
  const [usersInfo, setUsersInfo] = useState<UsersInfo[]>([]);
  const [topLayer, setTopLayer] = useState<Layer | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isLiveClosed, setIsLiveClosed] = useState<boolean>(false);

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
        setRoomInfo({ ...roomInfo, ...res.data });
        const socketIo = io(`${process.env.REACT_APP_RTC_URL}`, {
          transports: ['websocket'],
        });

        socketIo.emit('join', {
          username: res.data.username,
          userId: roomInfo.userId,
          roomId: roomId,
          roomTitle: res.data.roomTitle,
          token: localStorage.getItem('token'),
        });

        socketIo.on('error', (message: { error: string }) => {
          MySwal.fire({
            title: <p>{`${message.error}`}</p>,
            text: '홈으로 돌아갑니다.',
          });
          // .then(
          // () =>
          // (window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`),
          // );
        });

        socketIo.on('roomUsers', (message: RoomUsers) => {
          setRoomUsers(message);
        });

        socketIo.on('connect', () => {
          setSocket(socketIo);
        });
      })
      .catch(
        () =>
          MySwal.fire({
            title: <p>{'오류가 발생했습니다.'}</p>,
            text: '홈으로 돌아갑니다.',
          }),
        // .then(
        // () =>
        // (window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`),
        // ),
      );
  }, []);

  //@ Function: Recieve Close Event
  useEffect(() => {
    if (!isLiveClosed) return;
    Swal.fire({
      title: '라이브가 종료되었습니다.',
      text: '홈 화면으로 이동합니다.',
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: '  이동(사실은 안감)',
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('홈 화면으로 이동하는 로직이 들어감');
        setIsLiveClosed(false);
      }
    });
  }, [isLiveClosed]);

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

  return (
    <>
      <SidebarComponent
        topLayer={topLayer}
        isLiveClosed={isLiveClosed}
        layers={layers}
        roomInfo={roomInfo}
        setTopLayer={setTopLayer}
        setIsLiveClosed={setIsLiveClosed}
        users={usersInfo}
      />
      <DrawComponent
        topLayer={topLayer}
        isLiveClosed={isLiveClosed}
        layers={layers}
        roomInfo={roomInfo}
        roomUsers={roomUsers}
        socket={socket}
        setTopLayer={setTopLayer}
        setIsLiveClosed={setIsLiveClosed}
        setLayers={setLayers}
      />
      {/* <ChatComponent
        userName={roomInfo.userName}
        socket={socket}
      ></ChatComponent> */}
    </>
  );
}

export default LiveDrawing;
