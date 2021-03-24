import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
import axios from 'axios';
import { ResponseRoomInfo, roomInfo } from '../interfaces/room-info-interface';

export default function testComponent() {
  const [members, setMembers] = useState<roomInfo[]>([]);
  useEffect(() => {
    let temp_url = window.location.pathname;
    temp_url = temp_url.substring(6);
    // console.log(temp_url);

    axios.get('http://localhost:8080/room/entrance', { params: { uuid: temp_url } }).then((res: ResponseRoomInfo) => {
      console.log(res.data);
      setMembers(res.data);
    });
  }, []);

  return (
    <>
      <div>방 들어감</div>
      {members.map((member: roomInfo, index: number) => {
        console.log(member);
        return <div key={index}>{member.members.memberName}</div>;
      })}
    </>
  );
}
