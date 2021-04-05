import React from 'react';
import UserSelectButtonComponent from './components/UserSelectButtonComponent';
import CloseButtonComponent from './components/CloseButtonComponent';

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
        activeLayer={props.activeLayer}
        roomInfo={props.roomInfo}
        layers={props.layers}
        setActiveLayer={props.setActiveLayer}
      />
      <div className='flex-grow'></div>
      <CloseButtonComponent
        isHost={props.isHost}
        setIsLiveClosed={props.setIsLiveClosed}
      />
    </div>
  );
}

export default SidebarComponent;
