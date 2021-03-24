import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { MessageForm } from '../interfaces/message-form-interface';
import { ChatComponentChildrenProps } from '../interfaces/chat-component-props-interface';

export function ChatInputComponent(props: ChatComponentChildrenProps) {
  const [messageForm, setMessageForm] = useState<MessageForm>({
    userId: props.userId,
    text: '',
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const { userId, text } = messageForm;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageForm({ userId: messageForm.userId, text: e.target.value });
  };

  const sendMessage = (
    e:
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (props.socket) {
      if (e) {
        e.preventDefault();
      }
      if (messageForm.text) {
        props.socket.emit('send message', messageForm);
        setMessageForm({
          userId: props.userId,
          text: '',
        });
        if (inputRef.current) {
          inputRef.current.value = '';
          inputRef.current.focus();
        }
      }
    }
  };

  return (
    <div>
      <input
        className='input'
        type='text'
        onChange={onChange}
        ref={inputRef}
        onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
      ></input>
      <button className='input' onClick={(e) => sendMessage(e)}>
        메세지 보내기
      </button>
    </div>
  );
}
