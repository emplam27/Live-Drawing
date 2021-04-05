let users = []

const addUser = ({ socketId, userName, userId, roomId }) => {
  const existingUser = users.find(
    user => user.roomId === roomId && user.userId === userId
  )

  if (existingUser) {
    return { error: '이미 접속 중 입니다.' }
  }

  const user = { socketId, userName, userId, roomId }
  // console.log(user)
  users.push(user)
  return user
}

const removeUser = socketId => {
  const index = users.findIndex(user => user.socketId === socketId)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

const getUser = socketId => {
  return users.find(user => user.socketId === socketId)
}

const getUsersInRoom = roomId => users.filter(user => user.roomId === roomId)

module.exports = { addUser, removeUser, getUser, getUsersInRoom }
