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
    if (!user || !userLayer) return null;
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
        <span className='flex justify-center items-center'>
          {/* {props.speakingUsers && props.speakingUsers.length >= 1 ? (
            <span className='animate-ping absolute h-10 w-10 rounded-full bg-black opacity-75'></span>
          ) : null} */}
          <img
            className={`w-12 h-12 relative  rounded-full  my-2   ${
              userLayer?.canvasId === props.topLayer?.canvasId
                ? 'ring-2 ring-white shadow-lg'
                : ''
            }`}
            src={`${user.userImage}`}
          />
        </span>
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
      if (users.length <= 3) {
        setCarouselCandidate(users);
        return;
      }

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
          className='w-full focus:outline-none'
          onClick={() => handleClick('prev')}
        >
          <i className='ri-arrow-up-s-line'></i>
        </button>

        {carouselCandidate.map((user: UserInfo) => {
          if (!user) return null;
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

        <button
          type='button'
          className='w-full focus:outline-none'
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
