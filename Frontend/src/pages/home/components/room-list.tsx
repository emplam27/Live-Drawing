import React, {useState, useEffect} from 'react'
import styles from './room-list.module.css'
import {ResponseEntranceProps, EntranceComponent, EntranceProps} from './entrance'

const axios = require('axios')


export function RoomListComponet() {
    const [rooms, setRooms] = useState<EntranceProps[]>([]);

    useEffect(() => {
        axios.get('/')
            .then((res: ResponseEntranceProps) => 
                setRooms(res.data)
            )
    })
    return (
        <div className={styles.roomList}>
            {rooms.forEach((room: EntranceProps) => {
                    return (
                        <EntranceComponent roomKey={room.roomKey} roomTitle={room.roomTitle} roomHost={room.roomHost} />
                    )
                })
            })
        </div>
    )
}