import React, { useState } from 'react';
import ChatScreenComponent from './components/ChatScreenComponent';
import ChatInputComponent from './components/ChatInputComponent';
import { ChatComponentProps } from './interfaces/chat-component-props-interface';

function ChatComponent(props: ChatComponentProps) {
  const [isChatOpened, setIsChatOpened] = useState<boolean>(false);

  const chatButtonStyle =
    'flex justify-center items-center w-20 h-20 cursor-pointer';
  const activeStyle = 'text-blue-500 hover:text-blue-600';
  const inactiveStyle = 'text-gray-500 hover:text-blue-600';

  return (
    <>
      {isChatOpened ? (
        <div
          className={`${chatButtonStyle} ${activeStyle}`}
          onClick={() => setIsChatOpened(!isChatOpened)}
        >
          <i className={'ri-2x ri-chat-4-line'}></i>
        </div>
      ) : (
        <div
          className={`${chatButtonStyle} ${inactiveStyle}`}
          onClick={() => setIsChatOpened(!isChatOpened)}
        >
          <i className={'ri-2x ri-chat-off-line'}></i>
        </div>
      )}
      <div
        className={`absolute flex flex-col bottom-0 left-20 w-1/4 h-2/3 shadow-md z-50 
      ${isChatOpened ? null : 'hidden'}`}
      >
        <ChatScreenComponent roomInfo={props.roomInfo} socket={props.socket} />
        <ChatInputComponent roomInfo={props.roomInfo} socket={props.socket} />
      </div>
    </>
  );
}

export default ChatComponent;
