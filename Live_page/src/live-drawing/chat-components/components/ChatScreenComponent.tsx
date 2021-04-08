import React, { useEffect, useState, useRef } from 'react';
import { ChatComponentProps } from '../interfaces/chat-component-props-interface';
import { MessageForm } from '../interfaces/message-form-interface';

function ChatScreenComponent(props: ChatComponentProps) {
  const [screen, setScreen] = useState<MessageForm[]>([]);
  const [container, setContainer] = useState<MessageForm[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.socket)
      props.socket.on('chat-message', (message: MessageForm) => {
        setContainer([...container, message]);
      });
  }, [props.socket]);

  useEffect(() => {
    setScreen([...screen, ...container]);
  }, [container]);

  const scrollBottom = () => {
    scrollRef.current?.scrollIntoView();
  };

  useEffect(() => {
    scrollBottom();
  }, [screen]);

  const messageStyle =
    'inline-block rounded-xl shadow-md px-4 py-2.5 mx-4 my-1.5';
  const myMessageStyle = 'bg-blue-500 text-right text-white self-end';
  const peerMessageStyle = 'bg-white text-left self-start';
  const adminMessageStyle =
    'bg-opacity-0 text-center font-bold self-center shadow-none';

  return (
    <div className='flex-auto flex flex-col bg-white bg-opacity-75 border overflow-auto pt-4'>
      {screen.map((message: MessageForm, index: number) => {
        return (
          <>
            {message.user !== 'admin' &&
            message.user !== props.roomInfo.username ? (
              <p className='text-sm text-left px-8'>{message.user}</p>
            ) : null}
            <div
              key={index}
              className={`
            ${
              message.user === props.roomInfo.username
                ? `${messageStyle} ${myMessageStyle}`
                : `${messageStyle} ${peerMessageStyle}`
            } 
            ${message.user === 'admin' ? `${adminMessageStyle}` : null}`}
            >
              <div className='break-all'>{message.text}</div>
              <div ref={scrollRef} />
            </div>
          </>
        );
      })}
    </div>
  );
}

export default ChatScreenComponent;
