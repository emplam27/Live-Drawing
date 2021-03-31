import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatScreenComponent } from './chatscreen';
import { ChatInputComponent } from './chatInput';
import { ChatComponentProps } from '../interfaces/chat-component-props-interface';
import io from 'socket.io-client';
import { RoomData } from '../interfaces/room-data';
import './chat.css';

export function ChatComponent(props: ChatComponentProps) {
  const [roomData, setRoomData] = useState<RoomData>();
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);
  const room = useParams<{ roomKey: string }>();
  // console.log(room);

  useEffect(() => {
    const socketIo = io(`${process.env.REACT_APP_RTC_URL}`, {
      transports: ['websocket'],
    });

    socketIo.emit('join', { userId: props.userId, room: room.roomKey });

    socketIo.on('roomData', (message: RoomData) => {
      setRoomData(message);
    });
    socketIo.on('connect', () => {
      setSocket(socketIo);
    });
  }, []);

  return (
    <div className='chatContainer'>
      <ChatScreenComponent
        userId={props.userId}
        socket={socket}
      ></ChatScreenComponent>
      <ChatInputComponent
        userId={props.userId}
        socket={socket}
      ></ChatInputComponent>
    </div>
  );
}
