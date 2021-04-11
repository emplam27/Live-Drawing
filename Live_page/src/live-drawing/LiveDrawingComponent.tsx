import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SidebarComponent from './sidebar-components/SidebarComponent';
import DrawComponent from './draw-components/DrawComponent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { RoomInfo, RoomUsers } from './interfaces/socket-interfaces';
import { Layer } from './interfaces/draw-components-interfaces';
import axios from 'axios';
import io from 'socket.io-client';
// import { v4 as uuid } from 'uuid';

function LiveDrawingComponent() {
  const { roomId } = useParams<{ roomId: string }>();

  //@ Socket State
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  //@ Room & Users Info States
  const [roomInfo, setRoomInfo] = useState<RoomInfo>({
    roomId: roomId,
    roomTitle: null,
    roomHostId: null,
    userId: localStorage.getItem('userId'),
    userImage: null,
    username: null,
  });
  const [roomUsers, setRoomUsers] = useState<RoomUsers | null>(null);
  const [topLayer, setTopLayer] = useState<Layer | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);

  //@ Modified Mode & Layers States
  const [isModifiedMode, setIsModifiedMode] = useState<boolean>(false);
  const [modifiedLayers, setModifiedLayers] = useState<Layer[]>([]);
  const [copyModifiedCanvasSignal, setCopyModifiedCanvasSignal] = useState<
    number | null
  >(null);

  //@ Lecture Start Mode State
  const [isLectureStarted, setIsLectureStarted] = useState<boolean>(false);

  //@ Dummy Data
  const dummyRoomInfo = {
    username: '김형우',
    userId: '47a064dd-ab37-4990-aef8-cca398b24b2b',
    userImage:
      'https://lh5.googleusercontent.com/-UD1QQESYljk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucntz6Rz06XZSwFKdXXnwkw2u24Ahw/s96-c/photo.jpg',
    roomId: roomId,
    roomHostId: '776a10b4-03e7-455c-88d4-f9f908e9b846',
    roomTitle: '12312421',
  };

  const dummyRoomUsers: RoomUsers = {
    roomId: 'feda6c99-f05a-4fdd-88f6-fa13de0a9e12',
    users: [
      {
        username: '김용욱',
        userId: '47a064dd-ab37-4990-aef8-cca398b24b2b',
        userImage:
          'https://lh3.googleusercontent.com/a-/AOh14Ggzk1sZlAeI4hnd0bZyYd7yS1Nqq04glqSQlywLpg=s96-c',
        roomId: 'feda6c99-f05a-4fdd-88f6-fa13de0a9e12',
        roomTitle: '12312421',
        socketId: null,
        agoraId: null,
      },
      {
        username: '김유석',
        userId: '73dd814c-8026-459b-a2ed-4863ddb79750',
        userImage:
          'https://lh6.googleusercontent.com/-h-I_zB0DmFk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnE3WNy2c7s-MYKHpFFSQgdcAifNg/s96-c/photo.jpg',
        roomId: 'feda6c99-f05a-4fdd-88f6-fa13de0a9e12',
        roomTitle: '12312421',
        socketId: null,
        agoraId: null,
      },
      {
        username: 'M K',
        userId: 'b02fcfc9-c8d2-4900-8b8b-a7e2b3fa342c',
        userImage:
          'https://lh5.googleusercontent.com/-0XZwgDcb5yU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnyQd6S3wBQrFAPoAVUkdUO3q6nMA/s96-c/photo.jpg',
        roomId: 'feda6c99-f05a-4fdd-88f6-fa13de0a9e12',
        roomTitle: '12312421',
        socketId: null,
        agoraId: null,
      },
      {
        username: '김형우',
        userId: '776a10b4-03e7-455c-88d4-f9f908e9b846',
        userImage:
          'https://lh5.googleusercontent.com/-UD1QQESYljk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucntz6Rz06XZSwFKdXXnwkw2u24Ahw/s96-c/photo.jpg',
        roomId: 'feda6c99-f05a-4fdd-88f6-fa13de0a9e12',
        roomTitle: '12312421',
        socketId: null,
        agoraId: null,
      },
    ],
  };

  const MySwal = withReactContent(Swal);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    // setRoomUsers(dummyRoomUsers);
    // setRoomInfo(dummyRoomInfo);

    const socketIo = io(`${process.env.REACT_APP_RTC_URL}`, {
      transports: ['websocket'],
    });

    socketIo.emit('join', dummyRoomInfo);

    socketIo.on('error', (message: { error: string }) => {
      MySwal.fire({
        title: <p>{`${message.error}`}</p>,
        text: '홈으로 돌아갑니다.',
      }).then(
        () => (window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`),
      );
    });

    socketIo.on('update-room-users', (message: RoomUsers) => {
      setRoomUsers(message);
      console.log('update-room-users', message);
    });

    socketIo.on('lecture-close', () => {
      Swal.fire({
        title: '라이브가 종료되었습니다.',
        text: '홈 화면으로 이동합니다.',
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '  이동',
        allowOutsideClick: false,
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`;
        }
      });
    });

    socketIo.on('connect', () => {
      setSocket(socketIo);
    });

    // axios
    //   .get(`${process.env.REACT_APP_API_URL}/live/${roomId}`, {
    //     params: { userId: roomInfo.userId },
    //     headers: headers,
    //   })
    //   .then((res) => {
    //     setRoomInfo({ ...roomInfo, ...res.data });

    //     const socketIo = io(`${process.env.REACT_APP_RTC_URL}`, {
    //       transports: ['websocket'],
    //     });

    //     socketIo.emit('join', {
    //       username: res.data.username,
    //       // username: roomInfo.username,
    //       userId: roomInfo.userId,
    //       userImage: res.data.userImage,
    //       roomId: roomId,
    //       roomTitle: res.data.roomTitle,
    //       // roomTitle: roomInfo.roomTitle,
    //       token: localStorage.getItem('token'),
    //     });

    //     socketIo.on('error', (message: { error: string }) => {
    //       MySwal.fire({
    //         title: <p>{`${message.error}`}</p>,
    //         text: '홈으로 돌아갑니다.',
    //       }).then(
    //         () =>
    //           (window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`),
    //       );
    //     });

    //     socketIo.on('update-room-users', (message: RoomUsers) => {
    //       setRoomUsers(message);
    //     });

    //     socketIo.on('lecture-close', () => {
    //       Swal.fire({
    //         title: '라이브가 종료되었습니다.',
    //         text: '홈 화면으로 이동합니다.',
    //         icon: 'warning',
    //         confirmButtonColor: '#3085d6',
    //         confirmButtonText: '  이동',
    //         allowOutsideClick: false,
    //       }).then((result) => {
    //         if (result.isConfirmed) {
    //           window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`;
    //         }
    //       });
    //     });

    //     socketIo.on('connect', () => {
    //       setSocket(socketIo);
    //     });
    //   });
    // // .catch(() =>
    // //   MySwal.fire({
    // //     title: <p>{'오류가 발생했습니다.'}</p>,
    // //     text: '홈으로 돌아갑니다.',
    // //   }).then(
    // //     () =>
    // //       (window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`),
    // //   ),
    // // );
    // window.addEventListener('beforeunload', (e: Event) => {
    //   e.preventDefault();
    //   axios.post(
    //     `${process.env.REACT_APP_API_URL}/${roomId}/disconnect`,
    //     { userId: roomInfo.userId },
    //     { headers: headers },
    //   );
    // });
  }, []);
  return (
    <>
      <SidebarComponent
        isModifiedMode={isModifiedMode}
        layers={layers}
        roomInfo={roomInfo}
        roomUsers={roomUsers}
        topLayer={topLayer}
        socket={socket}
        setTopLayer={setTopLayer}
        setIsLectureStarted={setIsLectureStarted}
        setIsModifiedMode={setIsModifiedMode}
      />
      <DrawComponent
        copyModifiedCanvasSignal={copyModifiedCanvasSignal}
        isLectureStarted={isLectureStarted}
        isModifiedMode={isModifiedMode}
        layers={layers}
        modifiedLayers={modifiedLayers}
        roomInfo={roomInfo}
        roomUsers={roomUsers}
        socket={socket}
        topLayer={topLayer}
        setCopyModifiedCanvasSignal={setCopyModifiedCanvasSignal}
        setIsLectureStarted={setIsLectureStarted}
        setIsModifiedMode={setIsModifiedMode}
        setLayers={setLayers}
        setModifiedLayers={setModifiedLayers}
        setTopLayer={setTopLayer}
      />
    </>
  );
}
export default LiveDrawingComponent;
