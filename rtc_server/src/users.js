let users = []

const addUser = ({
  socketId,
  username,
  userId,
  userImage,
  roomId,
  token,
  roomTitle,
  agoraId,
}) => {
  const existingUser = users.find(
    user => user.roomId === roomId && user.userId === userId
  )

  if (existingUser) {
    return { error: '이미 접속 중 입니다.' }
  }

  const user = {
    socketId,
    username,
    userId,
    userImage,
    roomId,
    token,
    roomTitle,
    agoraId,
  }
  console.log('users', user)
  users.push(user)
  return user
}

const removeUser = socketId => {
  const index = users.findIndex(user => user.socketId === socketId)

  if (index !== -1) {
    console.log('are you in??')
    return users.splice(index, 1)[0]
  }
}

const getUser = socketId => {
  return users.find(user => user.socketId === socketId)
}

const getUsersInRoom = roomId => users.filter(user => user.roomId === roomId)

const addUID = (uid, targetUserId) => {
  const user = users.find(user => user.userId === targetUserId)
  user.agoraId = uid
}

const getUserId = uid => {
  return users.find(user => user.agoraId === uid)['userId']
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  addUID,
  getUserId,
}
