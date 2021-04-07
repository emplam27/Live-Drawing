import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SidebarComponent from './sidebar-components';
import DrawComponent from './draw-components';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  RoomInfo,
  RoomUsers,
  UserProfileInfo,
} from './interfaces/socket-interfaces';
import { Layer } from './interfaces/draw-components-interfaces';
import axios from 'axios';
import io from 'socket.io-client';
// import { v4 as uuid } from 'uuid';
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
  const [userProfileInfos, setUserProfileInfos] = useState<UserProfileInfo[]>(
    [],
  );
  const [topLayer, setTopLayer] = useState<Layer | null>(null);
  const [layers, setLayers] = useState<Layer[]>([]);
  const [isLiveClosed, setIsLiveClosed] = useState<boolean>(false);
  const MySwal = withReactContent(Swal);
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `${localStorage.getItem('token')}`,
  };

  // const dummyUsersProfileInfo: UserProfileInfo[] = [
  //   {
  //     userId: '47a064dd-ab37-4990-aef8-cca398b24b2b',
  //     userImage:
  //       'https://lh3.googleusercontent.com/a-/AOh14Ggzk1sZlAeI4hnd0bZyYd7yS1Nqq04glqSQlywLpg=s96-c',
  //     username: '김용욱',
  //   },
  //   {
  //     userId: '73dd814c-8026-459b-a2ed-4863ddb79750',
  //     userImage:
  //       'https://lh6.googleusercontent.com/-h-I_zB0DmFk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnE3WNy2c7s-MYKHpFFSQgdcAifNg/s96-c/photo.jpg',
  //     username: '김유석',
  //   },
  //   {
  //     userId: 'b02fcfc9-c8d2-4900-8b8b-a7e2b3fa342c',
  //     userImage:
  //       'https://lh5.googleusercontent.com/-0XZwgDcb5yU/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucnyQd6S3wBQrFAPoAVUkdUO3q6nMA/s96-c/photo.jpg',
  //     username: 'M K',
  //   },
  //   {
  //     userId: '776a10b4-03e7-455c-88d4-f9f908e9b846',
  //     userImage:
  //       'https://lh5.googleusercontent.com/-UD1QQESYljk/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucntz6Rz06XZSwFKdXXnwkw2u24Ahw/s96-c/photo.jpg',
  //     username: '김형우',
  //   },
  // ];

  // const dummyRoomInfo = {
  //   roomId: roomId,
  //   roomHostId: '776a10b4-03e7-455c-88d4-f9f908e9b846',
  //   roomTitle: '12312421',
  //   userId: '776a10b4-03e7-455c-88d4-f9f908e9b846',
  //   username: '김형우',
  // };

  // const dummyRoomUsers: RoomUsers = {
  //   roomId: 'feda6c99-f05a-4fdd-88f6-fa13de0a9e12',
  //   users: [
  //     {
  //       roomId: 'feda6c99-f05a-4fdd-88f6-fa13de0a9e12',
  //       socketId: null,
  //       username: '김용욱',
  //       userId: '47a064dd-ab37-4990-aef8-cca398b24b2b',
  //     },
  //     {
  //       roomId: 'feda6c99-f05a-4fdd-88f6-fa13de0a9e12',
  //       socketId: null,
  //       username: '김유석',
  //       userId: '73dd814c-8026-459b-a2ed-4863ddb79750',
  //     },
  //     {
  //       roomId: 'feda6c99-f05a-4fdd-88f6-fa13de0a9e12',
  //       socketId: null,
  //       username: 'M K',
  //       userId: 'b02fcfc9-c8d2-4900-8b8b-a7e2b3fa342c',
  //     },
  //     {
  //       roomId: 'feda6c99-f05a-4fdd-88f6-fa13de0a9e12',
  //       socketId: null,
  //       username: '김형우',
  //       userId: '776a10b4-03e7-455c-88d4-f9f908e9b846',
  //     },
  //   ],
  // };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/live/${roomId}`, {
        params: { userId: roomInfo.userId },
        headers: headers,
      })
      .then((res) => {
        setRoomInfo({ ...roomInfo, ...res.data });
        // setRoomInfo({ ...roomInfo, ...dummyRoomUsers });

        const socketIo = io(`${process.env.REACT_APP_RTC_URL}`, {
          transports: ['websocket'],
        });
        socketIo.emit('join', {
          username: res.data.username,
          // username: roomInfo.username,
          userId: roomInfo.userId,
          roomId: roomId,
          roomTitle: res.data.roomTitle,
          // roomTitle: roomInfo.roomTitle,
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
        socketIo.on('update-room-users', (message: RoomUsers) => {
          setRoomUsers(message);
        });

        socketIo.on('live-closed', () => {
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
      })
      .catch(() =>
        MySwal.fire({
          title: <p>{'오류가 발생했습니다.'}</p>,
          text: '홈으로 돌아갑니다.',
        }).then(
          () =>
            (window.location.href = `${process.env.REACT_APP_HOMEPAGE_URL}`),
        ),
      );
    // window.addEventListener('beforeunload', (e: Event) => {
    //   e.preventDefault();
    //   axios.post(
    //     `${process.env.REACT_APP_API_URL}/${roomId}/disconnect`,
    //     { userId: roomInfo.userId },
    //     { headers: headers },
    //   );
    // });
  }, []);

  useEffect(() => {
    //   setUserProfileInfos(dummyUsersProfileInfo);

    axios
      .get(`${process.env.REACT_APP_API_URL}/live/${roomId}/users`, {
        params: { userId: roomInfo.userId },
        headers: headers,
      })
      .then((res) => {
        setUserProfileInfos(res.data);
      });
  }, [roomUsers]);
  return (
    <>
      <SidebarComponent
        isLiveClosed={isLiveClosed}
        layers={layers}
        roomInfo={roomInfo}
        topLayer={topLayer}
        socket={socket}
        userProfileInfos={userProfileInfos}
        setTopLayer={setTopLayer}
      />
      <DrawComponent
        isLiveClosed={isLiveClosed}
        layers={layers}
        roomInfo={roomInfo}
        roomUsers={roomUsers}
        socket={socket}
        topLayer={topLayer}
        setTopLayer={setTopLayer}
        setIsLiveClosed={setIsLiveClosed}
        setLayers={setLayers}
      />
    </>
  );
}
export default LiveDrawing;
