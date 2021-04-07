import React, { useState, useRef } from 'react';
import { MessageForm } from '../interfaces/message-form-interface';
import { ChatComponentProps } from '../interfaces/chat-component-props-interface';

export function ChatInputComponent(props: ChatComponentProps) {
  const [messageForm, setMessageForm] = useState<MessageForm>({
    user: props.username,
    text: '',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageForm({ user: props.username, text: e.target.value });
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
        props.socket.emit('chat-send-message', messageForm);
        setMessageForm({
          user: props.username,
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
