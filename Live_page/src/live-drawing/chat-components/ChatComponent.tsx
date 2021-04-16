import React, { useState, useEffect, useCallback } from 'react';

import ChatScreenComponent from './components/ChatScreenComponent';
import ChatInputComponent from './components/ChatInputComponent';
import {
  ChatComponentProps,
  MessageForm,
} from './interfaces/chat-component-props-interface';

function ChatComponent(props: ChatComponentProps) {
  const [isChatOpened, setIsChatOpened] = useState<boolean>(false);
  const [screen, setScreen] = useState<MessageForm[]>([]);
  const [chatAlert, setChatAlert] = useState<boolean>(false);

  const _handleChatScreenUpdate = useCallback((newMessage) => {
    setScreen((messages) => {
      setChatAlert(true);
      return [...messages, newMessage];
    });
  }, []);

  useEffect(() => {
    if (!chatAlert) return;
    setTimeout(() => setChatAlert(false), 2000);
  }, [chatAlert]);

  useEffect(() => {
    if (props.socket)
      props.socket.on('chat-message', (message: MessageForm) => {
        _handleChatScreenUpdate(message);
      });
  }, [props.socket]);

  const chatButtonStyle =
    'relative flex justify-center items-center w-20 h-20 cursor-pointer';
  const activeStyle = 'text-blue-500 hover:text-blue-600';
  const inactiveStyle = 'text-gray-500 hover:text-blue-600';
  const chatAlertStyle =
    'absolute top-1/4 right-1/4 inline-flex h-4 w-4 rounded-full bg-blue-500 transition duration-300';
  const chatAlertAnimationStyle =
    'absolute top-1/4 right-1/4 inline-flex h-4 w-4 rounded-full bg-blue-400 transition duration-300 animate-ping';

  return (
    <>
      {isChatOpened ? (
        <div
          className={`${chatButtonStyle} ${activeStyle}`}
          onClick={() => setIsChatOpened(!isChatOpened)}
        >
          <span
            className={`
              ${chatAlertAnimationStyle} 
              ${chatAlert ? 'opacity-75' : 'opacity-0'}
            `}
          ></span>
          <span
            className={`
              ${chatAlertStyle} 
              ${chatAlert ? 'opacity-100' : 'opacity-0'}
            `}
          ></span>
          <i className={'ri-2x ri-chat-4-line'}></i>
        </div>
      ) : (
        <div
          className={`${chatButtonStyle} ${inactiveStyle}`}
          onClick={() => setIsChatOpened(!isChatOpened)}
        >
          <span
            className={`
              ${chatAlertAnimationStyle} 
              ${chatAlert ? 'opacity-75' : 'opacity-0'}
            `}
          ></span>
          <span
            className={`
              ${chatAlertStyle} 
              ${chatAlert ? 'opacity-100' : 'opacity-0'}
            `}
          ></span>
          <i className={'ri-2x ri-chat-off-line'}></i>
        </div>
      )}
      <div
        className={`absolute flex flex-col bottom-0 left-20 w-1/4 h-2/3 shadow-md z-50 
      ${isChatOpened ? null : 'hidden'}`}
      >
        <ChatScreenComponent
          screen={screen}
          roomInfo={props.roomInfo}
          socket={props.socket}
        />
        <ChatInputComponent roomInfo={props.roomInfo} socket={props.socket} />
      </div>
    </>
  );
}

export default ChatComponent;
