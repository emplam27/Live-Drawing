import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'
import styles from './room-list.module.css'

interface EntranceProps {
    roomKey: string,
    roomTitle: string,
    roomHost: string
}

interface ResponseEntranceProps {
    data: EntranceProps[]
}

function EntranceComponent({ roomKey, roomTitle, roomHost }: EntranceProps) {

    return (
        <Link to={`/room/:${roomKey}`}>
            <div className={styles.entrance}>
                <h3>{roomTitle}</h3>
                <h4>방주인 : {roomHost}</h4>
            </div>
        </Link>
    )
}

export {EntranceProps, ResponseEntranceProps, EntranceComponent}