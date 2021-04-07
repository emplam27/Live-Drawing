import React, { useState, useRef } from 'react';
import { MessageForm } from '../interfaces/message-form-interface';
import { ChatComponentProps } from '../interfaces/chat-component-props-interface';

function ChatInputComponent(props: ChatComponentProps) {
  const [messageForm, setMessageForm] = useState<MessageForm>({
    user: props.roomInfo.username,
    text: '',
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageForm({ user: props.roomInfo.username, text: e.target.value });
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
        type='text'
        placeholder='메세지를 입력하세요.'
        onChange={onChange}
        ref={inputRef}
        onKeyPress={(e) => (e.key === 'Enter' ? sendMessage(e) : null)}
        className='px-4 py-1 w-full border text-base placeholder-gray-500 placeholder-opacity-50 focus:outline-none focus:border-blue-500'
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
