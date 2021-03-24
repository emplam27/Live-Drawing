import React, { useEffect, useState } from 'react';
import { Route } from 'react-router-dom';
const axios = require('axios');
//

interface Temp {
  memberPk: number;
  memberName: string;
  room: {
    roomPk: number;
    roomTitme: string;
    roomKey: string;
    roomHost: string;
  };
}

interface ResponseTemp {
  data: Temp[];
}

export default function testComponent() {
  const [members, setMembers] = useState<Temp[]>([]);
  useEffect(() => {
    let temp_url = window.location.pathname;
    temp_url = temp_url.substring(6);
    // console.log(temp_url);

    axios.get('http://localhost:8080/room/entrance', { params: { uuid: temp_url } }).then((res: ResponseTemp) => {
      console.log(res.data);
      setMembers(res.data);
    });
  }, []);

  return (
    <>
      <div>방 들어감</div>
      {members.map((member: Temp, index: number) => {
        console.log(member);
        return <div key={index}>{member.memberName}</div>;
      })}
    </>
  );
}
