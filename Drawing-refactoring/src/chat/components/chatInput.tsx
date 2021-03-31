import React, { useState, useRef } from 'react';
import { MessageForm } from '../interfaces/message-form-interface';
import { ChatComponentChildrenProps } from '../interfaces/chat-component-props-interface';

export function ChatInputComponent(props: ChatComponentChildrenProps) {
  const [messageForm, setMessageForm] = useState<MessageForm>({
    user: props.userId,
    text: '',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageForm({ user: messageForm.user, text: e.target.value });
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
          user: props.userId,
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
    <div className='input-container flex'>
      <input
        type='text'
        placeholder='메세지를 입력하세요.'
        onChange={onChange}
        ref={inputRef}
        onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
        className='px-4 py-1 w-full rounded border border-gray-300 shadow-sm text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
      />
      <button
        onClick={(e) => sendMessage}
        className='justify-center items-center bg-blue-500 hover:bg-blue-600 text-white text-lg font-semibold focus:outline-none focus:ring rounded px-3 py-1'
      >
        <i className='ri-send-plane-fill'></i>
      </button>
    </div>
  );
}
