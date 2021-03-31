export interface ChatComponentProps {
  userId: string | null;
}

export interface ChatComponentChildrenProps extends ChatComponentProps {
  socket: SocketIOClient.Socket | null;
}
