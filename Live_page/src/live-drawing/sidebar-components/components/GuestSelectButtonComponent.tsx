import React, { useState, useEffect } from 'react';

import { Layer } from '../../interfaces/draw-components-interfaces';
import { GuestSelectButtonComponentProps } from '../interfaces/guest-select-button-interfaces';
import { UserInfo } from '../../interfaces/socket-interfaces';

// import Carousel from 'react-multi-carousel';
// import 'react-multi-carousel/lib/styles.css';

function GuestSelectButtonComponent(props: GuestSelectButtonComponentProps) {
  if (!props.roomUsers || !props.roomUsers.users) return null;

  const selectTopLayer = (layer: Layer | undefined) => {
    if (layer) props.setTopLayer(layer);
  };

  function GuestButtonComponent({ user, userLayer }) {
    return (
      <div
        key={user.userId}
        onClick={() => selectTopLayer(userLayer)}
        className={`flex flex-col items-center py-4 cursor-pointer
          ${
            userLayer?.canvasId === props.topLayer?.canvasId
              ? 'bg-blue-500 text-white shadow-inner '
              : 'hover:bg-gray-200'
          }
        `}
      >
        <span className='flex h-3 w-3'>
          {props.speakingUsers &&
          user.agoraId &&
          props.speakingUsers.includes(user.agoraId) ? (
            <span className='animate-ping absolute inline-flex h-4 w-4 rounded-full bg-purple-400 opacity-75'></span>
          ) : null}
          <span className='relative inline-flex rounded-full h-3 w-3 bg-purple-500'></span>
        </span>
        <img
          className={`w-12 h-12 rounded-full my-2 ${
            userLayer?.canvasId === props.topLayer?.canvasId
              ? 'ring-2 ring-white shadow-lg'
              : ''
          }`}
          src={user.userImage}
          alt={user.username}
        />
        {props.roomInfo.userId === props.roomInfo.roomHostId ? (
          <p className={'w-full truncate px-2'}>{user.username}</p>
        ) : null}
      </div>
    );
  }

  function VerticalCarousel({ users }) {
    if (!users) return null;
    const [activeIndex, setActiveIndex] = useState(0);
    const [carouselCandidate, setCarouselCandidate] = useState([]);

    const handleClick = (direction) => {
      setActiveIndex((prevIndex) => {
        if (direction === 'next') {
          if (prevIndex + 1 > users.length - 1) return 0;
          else return prevIndex + 1;
        } else {
          if (prevIndex - 1 < 0) return users.length - 1;
          else return prevIndex - 1;
        }
      });
    };

    useEffect(() => {
      const tmp: any = [];
      for (let i = 0; i < 3; i++) {
        let index: number = activeIndex + i;
        if (index >= users.length) {
          index = index - users.length;
        }
        tmp.push(users[index]);
      }
      setCarouselCandidate(tmp);
    }, [activeIndex]);

    return (
      <div className='divide-y'>
        <button
          type='button'
          className='w-full'
          onClick={() => handleClick('prev')}
        >
          <i className='ri-arrow-up-s-line'></i>
        </button>

        <div className=''>
          {carouselCandidate.map((user: UserInfo) => {
            const userLayer = props.layers.find(
              (layer) => user.userId === layer.canvasId,
            );
            return (
              <GuestButtonComponent
                key={user.userId}
                user={user}
                userLayer={userLayer}
              />
            );
          })}
        </div>

        <button
          type='button'
          className='w-full'
          onClick={() => handleClick('next')}
        >
          <i className='ri-arrow-down-s-line'></i>
        </button>
      </div>
    );
  }
  return (
    <>
      <div className={`flex flex-col ${!props.isModifiedMode ? '' : 'hidden'}`}>
        <VerticalCarousel
          users={props.roomUsers.users.filter((user) => {
            return user.userId !== props.roomInfo.roomHostId;
          })}
        />
      </div>
    </>
  );
}

export default GuestSelectButtonComponent;
