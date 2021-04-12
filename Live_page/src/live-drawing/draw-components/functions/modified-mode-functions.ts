import {
  CanvasCtxTable,
  Layer,
} from '../../interfaces/draw-components-interfaces';
import {
  RoomInfo,
  RoomUsers,
  UserInfo,
} from '../../interfaces/socket-interfaces';

export function copyImageToModifiedCanvasForHostMode(
  topLayer: Layer,
  canvasCtxTable: CanvasCtxTable,
) {
  const userCanvas: HTMLElement | null = document.getElementById(
    topLayer.canvasId,
  );
  if (!userCanvas) return;
  const modifiedCanvasCtx: CanvasRenderingContext2D | null =
    canvasCtxTable[`modified-${topLayer.canvasId}`];
  if (!modifiedCanvasCtx) return;
  modifiedCanvasCtx.clearRect(
    0,
    0,
    (window.innerWidth - 60) * 0.5,
    window.innerHeight,
  );
  modifiedCanvasCtx.drawImage(userCanvas as HTMLCanvasElement, 0, 0);
}

export function copyImageToModifiedCanvasForGuestMode(
  roomInfo: RoomInfo,
  canvasCtxTable: CanvasCtxTable,
) {
  if (!roomInfo.userId) return;
  const userCanvas: HTMLElement | null = document.getElementById(
    roomInfo.userId,
  );
  if (!userCanvas) return;
  const modifiedCanvasCtx: CanvasRenderingContext2D | null =
    canvasCtxTable[`modified-${roomInfo.userId}`];
  if (!modifiedCanvasCtx) return;
  modifiedCanvasCtx.clearRect(
    0,
    0,
    (window.innerWidth - 60) * 0.5,
    window.innerHeight,
  );
  modifiedCanvasCtx.drawImage(userCanvas as HTMLCanvasElement, 0, 0);
}

export function sendModifiedModeMessage(
  event: string,
  roomUsers: RoomUsers,
  topLayer: Layer,
  socket: SocketIOClient.Socket,
) {
  const targetUser: UserInfo | undefined = roomUsers.users.find(
    (user: UserInfo) => {
      return user.userId === topLayer?.canvasId;
    },
  );
  if (!targetUser) return;
  const message: any = {
    userId: targetUser.userId,
  };
  console.log(`${message.userId}에게 ${event} 이벤트 발생`);
  socket.emit(event, message);
}
