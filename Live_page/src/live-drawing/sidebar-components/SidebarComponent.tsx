import React from 'react';
import UserSelectButtonComponent from './components/UserSelectButtonComponent';
import CloseButtonComponent from './components/CloseButtonComponent';
import SaveImageComponent from './components/SaveImageComponent';
import VoiceChatComponent from '../voice-components/VoiceChatComponent';
import ChatComponent from '../chat-components/ChatComponent';

import { SidebarComponentProps } from '../interfaces/sidebar-components-interfaces';

function SidebarComponent(props: SidebarComponentProps) {
  return (
    <div className='flex-initial w-20 flex flex-col border-r divide-y'>
      <div className='h-20 flex flex-wrap justify-center content-center'>
        <i className='ri-2x ri-leaf-fill text-blue-500'></i>
      </div>
      <UserSelectButtonComponent
        topLayer={props.topLayer}
        userProfileInfos={props.userProfileInfos}
        roomInfo={props.roomInfo}
        layers={props.layers}
        setTopLayer={props.setTopLayer}
      />
      <div className='flex-grow'></div>
      <VoiceChatComponent />
      <ChatComponent roomInfo={props.roomInfo} socket={props.socket} />
      <div className='flex-grow'></div>
      <SaveImageComponent layers={props.layers} roomInfo={props.roomInfo} />
      <CloseButtonComponent
        roomInfo={props.roomInfo}
        // setIsLiveClosed={props.setIsLiveClosed}
        socket={props.socket}
      />
    </div>
  );
}

export default SidebarComponent;
