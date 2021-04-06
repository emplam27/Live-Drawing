import React from 'react';
import UserSelectButtonComponent from './components/UserSelectButtonComponent';
import CloseButtonComponent from './components/CloseButtonComponent';
import VoiceChatComponent from '../voice-components/';
import SaveImageComponent from '../draw-components/components/SaveImageComponent';

import { SidebarComponentProps } from '../interfaces/sidebar-components-interfaces';

function SidebarComponent(props: SidebarComponentProps) {
  return (
    <div className='flex-initial w-20 flex flex-col border-r divide-y'>
      <div className='h-20 flex flex-wrap justify-center content-center'>
        <div className=''>
          <i className='ri-2x ri-leaf-fill text-blue-500'></i>
        </div>
      </div>

      <div className='flex-grow'></div>
      <UserSelectButtonComponent
        topLayer={props.topLayer}
        userProfileInfos={props.userProfileInfos}
        roomInfo={props.roomInfo}
        layers={props.layers}
        setTopLayer={props.setTopLayer}
      />
      <div className='flex-grow'></div>
      <p>스피커 버튼</p>
      <VoiceChatComponent />
      <div className='flex-grow'></div>
      <SaveImageComponent layers={props.layers} roomInfo={props.roomInfo} />
      <div className='flex-grow'></div>
      <p>유저, 채팅 버튼</p>
      <div className='flex-grow'></div>
      <CloseButtonComponent
        roomInfo={props.roomInfo}
        setIsLiveClosed={props.setIsLiveClosed}
      />
    </div>
  );
}

export default SidebarComponent;
