import React, { useState, useRef, useEffect } from 'react';

import {
  ChatInputComponentProps,
  MessageForm,
} from '../interfaces/chat-component-props-interface';

function ChatInputComponent(props: ChatInputComponentProps) {
  const [messageForm, setMessageForm] = useState<MessageForm>({
    user: props.roomInfo.username,
    text: '',
  });
  const [, setTextLength] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTextLength(messageForm.text.length);
  }, [messageForm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (messageForm.text.length <= 200) {
      setMessageForm({ user: props.roomInfo.username, text: e.target.value });
    }
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
          user: props.roomInfo.username,
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
    <div className='flex-none flex bottom-0 overflow-auto'>
      <input
        maxLength={200}
        type='text'
        placeholder='메세지를 입력하세요.'
        onChange={onChange}
        ref={inputRef}
        onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
        className='px-4 py-1 w-full border text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
        autoComplete='off'
      />
      <button
        onClick={sendMessage}
        className='w-12 h-12 flex justify-center items-center text-white bg-blue-500 hover:bg-blue-600 focus:outline-none'
      >
        <i className='ri-xl ri-send-plane-fill'></i>
      </button>
    </div>
  );
}

export default ChatInputComponent;
