import React from 'react';
import { UsersComponentProps } from '../interfaces/UsersComponentProps';

export function UsersComponent(props: UsersComponentProps) {
  const onClick = (targetId: string) => {
    props.setSelectedId(targetId);
  };
  return (
    <div>
      {props.users.map((user) => {
        if (user.userId !== props.roomInfo.userId)
          return (
            <div onClick={() => onClick(user.userId)}>
              <img
                src={user.userImage}
                width='12'
                height='12'
                alt={`${user.userName}`}
              />
              <p>{`${user.userName}`}</p>
            </div>
          );
      })}
    </div>
  );
}
