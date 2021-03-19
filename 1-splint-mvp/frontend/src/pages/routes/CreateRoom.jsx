import React from 'react'
import { v1 as uuid } from 'uuid'

const CreateRoom = props => {
  function create() {
    console.log(props)
    const id = uuid()
    props.history.push(`/rtc/${id}`)
  }

  return <button onClick={create}>Create room</button>
}

export default CreateRoom
