import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './room-list.css';
import { EntranceProps } from '../interfaces/entrance-props-interface';

export function EntranceComponent(props: EntranceProps) {
  return (
    <Link to={`/room/${props.roomKey}`}>
      <div className={'entrance'}>
        <h3>{props.roomTitle}</h3>
        <h4>방주인 : {props.roomHost}</h4>
      </div>
    </Link>
  );
}
