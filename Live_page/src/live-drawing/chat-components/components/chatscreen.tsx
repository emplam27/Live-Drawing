import React, { useEffect, useState, useRef } from 'react';
import { ChatComponentProps } from '../interfaces/chat-component-props-interface';
import { MessageForm } from '../interfaces/message-form-interface';
import '../index.css';

export function ChatScreenComponent(props: ChatComponentProps) {
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

  return (
    <div className='chatScreen'>
      {screen.map((message: MessageForm, index: number) => {
        return (
          <div
            key={index}
            className={`${
              message.user === props.username ? 'message my' : 'message'
            } ${message.user === 'admin' ? 'admin' : ''}`}
          >
            {message.user === 'admin' || message.user === props.username ? (
              ''
            ) : (
              <p className='username'>{message.user}</p>
            )}
            <div className='chat-text'>
              <p>{message.text}</p>
            </div>
            <div ref={scrollRef} />
          </div>
        );
      })}
    </div>
  );
}
