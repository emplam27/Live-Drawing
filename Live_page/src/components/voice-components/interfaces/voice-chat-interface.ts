import React, { ReactSVG } from 'react';
import { RoomInfo, RoomUsers } from '../../interfaces/socket-interfaces';

export interface VoiceChatComponentProps {
  roomInfo: RoomInfo;
  socket: SocketIOClient.Socket | null;
  roomUsers: RoomUsers | null;
  speakingUsers: number[] | null;
  setSpeakingUsers: React.Dispatch<React.SetStateAction<number[] | null>>;
}
