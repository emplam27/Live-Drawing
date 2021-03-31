import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router';
import { ResponseUserInfo, UserInfo } from './interfaces/user-info-interface';

export function LiveRoomComponent() {
  const roomId = useParams();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/room/${roomId}`)
      .then((res: ResponseUserInfo) => setUserInfo(res.data));
  });
  userInfo;
}
