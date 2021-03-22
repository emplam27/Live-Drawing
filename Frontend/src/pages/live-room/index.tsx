import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router'

interface UserInfo {
    userId: string,
    userCount: number
}

interface ResponseUserInfo {
    data: UserInfo
}

export function LiveRoomComponent() {
    const roomId = useParams()
    const [userInfo, setUserInfo] = useState<UserInfo>()
    useEffect(() => {
        axios.get(`/room/${roomId}`)
            .then((res: ResponseUserInfo) => 
                setUserInfo(res.data)
            )
    })
    console.log(userInfo)
}