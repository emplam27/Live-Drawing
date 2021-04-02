import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatScreenComponent } from './chatscreen';
import { ChatInputComponent } from './chatInput';
import { ChatComponentProps } from '../interfaces/chat-component-props-interface';
import io from 'socket.io-client';
import { RoomData } from '../interfaces/room-data';
import './chat.css';

export function ChatComponent(props: ChatComponentProps) {
  return (
    <div className='chatContainer'>
      <ChatScreenComponent
        userName={props.userName}
        socket={props.socket}
      ></ChatScreenComponent>
      <ChatInputComponent
        userName={props.userName}
        socket={props.socket}
      ></ChatInputComponent>
    </div>
  );
}
