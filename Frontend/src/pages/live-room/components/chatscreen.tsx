import React, { useEffect, useState, useRef } from 'react';
import { ChatComponentChildrenProps } from '../interfaces/chat-component-props-interface';
import { MessageForm } from '../interfaces/message-form-interface';
import './chat.css';

export function ChatScreenComponent(props: ChatComponentChildrenProps) {
  const [screen, setScreen] = useState<MessageForm[]>([]);
  const [container, setContainer] = useState<MessageForm[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.socket)
      props.socket.on('message', (message: MessageForm) => {
        setContainer([...container, message]);
        console.log(props.socket?.id);
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
          <div key={index} className={message.userId === props.userId ? 'message my' : 'message'}>
            <p className='userName'>{message.userId}</p>
            <p>{message.text}</p>
            <div ref={scrollRef} />
          </div>
        );
      })}
    </div>
  );
}
