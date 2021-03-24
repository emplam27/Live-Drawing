export interface ChatComponentProps {
  userId: string;
}

export interface ChatComponentChildrenProps extends ChatComponentProps {
  socket: SocketIOClient.Socket | null;
}
