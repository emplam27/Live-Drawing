import React, { useState } from 'react';
import UserSelectButtonComponent from './components/UserSelectButtonComponent';
import CloseButtonComponent from './components/CloseButtonComponent';
import SaveImageComponent from './components/SaveImageComponent';
import VoiceChatComponent from '../voice-components/VoiceChatComponent';
import ChatComponent from '../chat-components/ChatComponent';
import ClearCanvasComponent from './components/ClearCanvasComponent';
import { SidebarComponentProps } from '../interfaces/sidebar-components-interfaces';
// import { SpeakingUser } from './interfaces/speaking-user-interfaces';

function SidebarComponent(props: SidebarComponentProps) {
  const [speakingUsers, setSpeakingUsers] = useState<number[] | null>(null);

  function changeModifiedMode() {
    props.setIsModifiedMode(!props.isModifiedMode);
  }

  function startLecture() {
    props.setIsLectureStarted(true);
  }

  return (
    <div className='flex-initial w-20 flex flex-col border-r divide-y'>
      <div className='h-20 flex flex-wrap justify-center content-center'>
        <i className='ri-2x ri-leaf-fill text-blue-500'></i>
      </div>
      <UserSelectButtonComponent
        isModifiedMode={props.isModifiedMode}
        layers={props.layers}
        roomInfo={props.roomInfo}
        roomUsers={props.roomUsers}
        topLayer={props.topLayer}
        setTopLayer={props.setTopLayer}
        speakingUsers={speakingUsers}
        setSpeakingUsers={setSpeakingUsers}
      />
      <div className='flex-grow'></div>
      <button onClick={changeModifiedMode}>첨삭모드전환</button>
      <button onClick={startLecture}>강의시작</button>
      <div className='flex-grow'></div>
      <VoiceChatComponent
        roomInfo={props.roomInfo}
        socket={props.socket}
        roomUsers={props.roomUsers}
        speakingUsers={speakingUsers}
        setSpeakingUsers={setSpeakingUsers}
      />
      <ChatComponent roomInfo={props.roomInfo} socket={props.socket} />
      <ClearCanvasComponent layers={props.layers} roomInfo={props.roomInfo} />
      <div className='flex-grow'></div>
      <SaveImageComponent layers={props.layers} roomInfo={props.roomInfo} />
      <CloseButtonComponent roomInfo={props.roomInfo} socket={props.socket} />
    </div>
  );
}

export default SidebarComponent;
