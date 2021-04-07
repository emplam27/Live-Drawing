import React from 'react';
import { ChatScreenComponent } from './components/chatscreen';
import { ChatInputComponent } from './components/chatInput';
import { ChatComponentProps } from './interfaces/chat-component-props-interface';
import './index.css';

function ChatComponent(props: ChatComponentProps) {
  return (
    <div className='col-start-2 col-end-3 absolute'>
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

export default ChatComponent;