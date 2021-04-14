import React, { useState, useEffect } from 'react';

import CursorComponent from './draw-cursor-components/components/CursorComponent';
import ToolbarComponent from './components/ToolbarComponent';
import HostModeComponent from './components/HostModeComponent';
import GuestModeComponent from './components/GuestModeComponent';

import { draw, erase } from './functions/draw-functions';
import {
  CanvasCtxTable,
  CursorPosition,
  DrawComponentProps,
  DrawData,
  EndData,
  EraseData,
  HostMoveData,
  Layer,
  // Point,
  StartData,
} from '../interfaces/draw-components-interfaces';
import { UserInfo } from '../interfaces/socket-interfaces';
import { drawEnd, drawStart } from './functions/mouse-event-functions';
import { HostCursorComponent } from './draw-cursor-components/components/HostCursorComponent';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

function DrawComponent(props: DrawComponentProps) {
  //@ Drawing's States
  const [activeTool, setActiveTool] = useState<string>('');
  const [color, setColor] = useState('#000000');
  const [cursorWidth, setCursorWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(30);
  const [lineWidth, setLineWidth] = useState(5);
  const [canvasCtxTable, setCanvasCtxTable] = useState<CanvasCtxTable>({});
  const [cursorPosition, setCursorPosition] = useState<CursorPosition | null>(
    null,
  );
  const [hidden, setHidden] = useState(false);
  const [position, setPosition] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  //@ Connection's States
  const [pencilSignal, setPencilSignal] = useState<DrawData | null>(null);
  const [eraserSignal, setEraserSignal] = useState<EraseData | null>(null);
  const [startSignal, setStartSignal] = useState<StartData | null>(null);
  const [endSignal, setEndSignal] = useState<EndData | null>(null);
  const [newLayerCtxSignal, setNewLayerCtxSignal] = useState<number | null>(
    null,
  );
  // const [hostMoveSignal, setHostMoveSignal] = useState<HostMoveData | null>(
  //   null,
  // );
  const [historyFlag, setHistoryFlag] = useState<boolean>(true);

  const MySwal = withReactContent(Swal);

  //@ Function: Socket Connect Init
  useEffect(() => {
    if (!props.socket) return;
    props.socket.on('draw-pencil', (message: DrawData) =>
      setPencilSignal(message),
    );
    props.socket.on('draw-eraser', (message: EraseData) =>
      setEraserSignal(message),
    );
    props.socket.on('draw-start', (message: StartData) =>
      setStartSignal(message),
    );
    props.socket.on('draw-end', (message: EndData) => {
      setEndSignal(message);
    });
    // props.socket.on('host-move', (message: HostMoveData) => {
    //   setHostMoveSignal(message);
    // });
    props.socket.on('modified-mode-start', (message: any) => {
      if (message.userId !== props.roomInfo.userId) return;
      console.log(`modified-mode-start 이벤트가 왔음`);
      props.setIsModifiedMode(true);
      props.setIsCompareMode(false);
      MySwal.fire({
        icon: 'success',
        title: '선생님이 첨삭을 시작합니다.',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false,
      });
    });
    props.socket.on('modified-mode-end', (message: any) => {
      if (message.userId !== props.roomInfo.userId) return;
      console.log(`modified-mode-end 이벤트가 왔음`);
      props.setIsModifiedMode(false);
      MySwal.fire({
        icon: 'success',
        title: '선생님이 첨삭을 종료합니다.',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        allowOutsideClick: false,
      });
    });
    props.socket.on('modified-mode-copy-canvas', (message: any) => {
      if (message.userId !== props.roomInfo.userId) return;
      console.log(`modified-mode-copy-canvas 이벤트가 왔음`);
      props.setCopyModifiedCanvasSignal(new Date().getTime());
    });
  }, [props.socket]);

  //@ Function: Recieve Start Event
  useEffect(() => {
    if (startSignal === null) return;
    const canvasCtx = canvasCtxTable[startSignal.canvasId];
    if (!canvasCtx) return;
    drawStart(canvasCtx, startSignal.point);
    if (
      (startSignal.canvasId === props.roomInfo.roomHostId &&
        startSignal.canvasId === props.topLayer?.canvasId) ||
      startSignal.canvasId === props.roomInfo.userId ||
      startSignal.canvasId === 'modified-' + props.roomInfo.userId
    )
      setCursorPosition({ point: startSignal.point, canvas: canvasCtx.canvas });
  }, [startSignal]);

  //@ Function: Recieve End Event
  useEffect(() => {
    if (endSignal === null) return;
    const canvasCtx = canvasCtxTable[endSignal.canvasId];
    drawEnd(canvasCtx, endSignal.point, endSignal.isMoved);
    if (
      (endSignal.canvasId === props.roomInfo.roomHostId &&
        endSignal.canvasId === props.topLayer?.canvasId) ||
      endSignal.canvasId === props.roomInfo.userId ||
      endSignal.canvasId === 'modified-' + props.roomInfo.userId
    )
      setCursorPosition(null);
  }, [endSignal]);

  //@ Function: Recieve Pencil Event
  useEffect(() => {
    if (pencilSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[pencilSignal.canvasId];
    if (!canvasCtx) return;
    draw(pencilSignal, canvasCtx);
    if (
      (pencilSignal.canvasId === props.roomInfo.roomHostId &&
        pencilSignal.canvasId === props.topLayer?.canvasId) ||
      pencilSignal.canvasId === props.roomInfo.userId ||
      pencilSignal.canvasId === 'modified-' + props.roomInfo.userId
    )
      setCursorPosition({
        point: pencilSignal.currentPoint,
        canvas: canvasCtx.canvas,
      });
  }, [pencilSignal]);

  //@ Function: Recieve Eraser Event
  useEffect(() => {
    if (eraserSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[eraserSignal.canvasId];
    if (!canvasCtx) return;
    erase(eraserSignal, canvasCtx);
    if (
      (eraserSignal.canvasId === props.roomInfo.roomHostId &&
        eraserSignal.canvasId === props.topLayer?.canvasId) ||
      eraserSignal.canvasId === props.roomInfo.userId ||
      eraserSignal.canvasId === 'modified-' + props.roomInfo.userId
    )
      setCursorPosition({
        point: eraserSignal.currentPoint,
        canvas: canvasCtx.canvas,
      });
  }, [eraserSignal]);

  // useEffect(() => {
  //   if (hostMoveSignal === null) return;
  //   const canvasCtx: CanvasRenderingContext2D =
  //     canvasCtxTable[hostMoveSignal.canvasId];
  //   setCursorPosition({
  //     point: hostMoveSignal.point,
  //     canvas: canvasCtx.canvas,
  //   });
  // }, [hostMoveSignal]);

  //@ roomData가 업데이트 될 때마다 layers를 재구성, layer 추가&삭제 역할수행
  useEffect(() => {
    if (
      props.roomInfo.roomHostId === null ||
      props.roomInfo.userId === null ||
      props.roomInfo.username === null ||
      props.roomUsers === null ||
      props.roomUsers.users === undefined
    )
      return;

    // user들의 정보로 layers 생성
    const newLayers: Layer[] = props.roomUsers.users.map((user: UserInfo) => {
      const newLayer: Layer = {
        username: user.username,
        canvasId: user.userId,
        buttonId: `${user.userId}-button`,
        canvasCtx: null,
      };
      return newLayer;
    });
    props.setLayers([...newLayers]);

    // 호스트이면 모든 사용자의 modified layer 생성, 게스트이면 본인의 modified layer만 생성
    switch (props.roomInfo.roomHostId === props.roomInfo.userId) {
      case true:
        const newModifiedLayers: Layer[] = props.roomUsers.users.map(
          (user: UserInfo) => {
            const newModifiedLayer: Layer = {
              username: `modified-${user.username}`,
              canvasId: `modified-${user.userId}`,
              buttonId: `modified-${user.userId}-button`,
              canvasCtx: null,
            };
            return newModifiedLayer;
          },
        );
        props.setModifiedLayers([...newModifiedLayers]);
        break;

      case false:
        const newModifiedLayer: Layer = {
          username: `modified-${props.roomInfo.username}`,
          canvasId: `modified-${props.roomInfo.userId}`,
          buttonId: `modified-${props.roomInfo.userId}-button`,
          canvasCtx: null,
        };
        props.setModifiedLayers([newModifiedLayer]);
        break;
    }

    // 호스트이면 본인을 제외한 아무 레이어 선택, 게스트이면 호스트 레이어 선택
    if (props.topLayer === null && props.roomUsers.users.length > 1) {
      let targetLayer: Layer = newLayers[0];
      switch (props.roomInfo.roomHostId === props.roomInfo.userId) {
        case true:
          const guestLayer = newLayers.find((layer: Layer) => {
            return props.roomInfo.userId !== layer.canvasId;
          });
          if (guestLayer) targetLayer = guestLayer;
          break;

        case false:
          const hostLayer = newLayers.find((layer: Layer) => {
            return props.roomInfo.roomHostId === layer.canvasId;
          });
          if (hostLayer) targetLayer = hostLayer;
          break;
      }
      props.setTopLayer(targetLayer);
    }

    // 새로운 연결인 경우에는 history data 요청
    if (historyFlag && props.socket) {
      props.socket.emit('require-history');
      setHistoryFlag(false);
    }

    // CanvasCtxTable 갱신
    setNewLayerCtxSignal(new Date().getTime());
  }, [props.roomUsers]);

  //@ layer가 생성되면, canvasContext를 가지고 있지 않은 layer를 찾아 연결
  useEffect(() => {
    // User Layer 중 Ctx가 없는 Layer를 찾아 ctx 추가
    const layersLength: number = props.layers.length;
    if (layersLength === 0 || newLayerCtxSignal === null) return;

    const tmpCanvasCtxTable = { ...canvasCtxTable };
    const userlayers = [...props.layers];
    for (const layer of userlayers) {
      if (layer.canvasCtx) continue;

      const canvas: HTMLElement | null = document.getElementById(
        layer.canvasId,
      );
      if (!canvas) continue;

      const ctx: CanvasRenderingContext2D | null = (canvas as HTMLCanvasElement).getContext(
        '2d',
      );
      if (!ctx) continue;

      layer.canvasCtx = ctx;
      tmpCanvasCtxTable[layer.canvasId] = layer.canvasCtx;
    }
    props.setLayers(userlayers);

    // Modified Layer 중 Ctx가 없는 Layer를 찾아 ctx 추가
    const modifiedLayers = [...props.modifiedLayers];
    for (const layer of modifiedLayers) {
      if (layer.canvasCtx) continue;

      const canvas: HTMLElement | null = document.getElementById(
        layer.canvasId,
      );
      if (!canvas) continue;

      const ctx: CanvasRenderingContext2D | null = (canvas as HTMLCanvasElement).getContext(
        '2d',
      );
      if (!ctx) continue;

      layer.canvasCtx = ctx;
      tmpCanvasCtxTable[layer.canvasId] = layer.canvasCtx;
    }
    props.setModifiedLayers(modifiedLayers);

    setCanvasCtxTable(tmpCanvasCtxTable);
  }, [newLayerCtxSignal]);

  const layerContainerGridStyle =
    'w-full grid grid-cols-2 divide-x-4 divide-dashed divide-gray-300';

  return (
    <>
      <CursorComponent
        cursorWidth={cursorWidth}
        hidden={hidden}
        position={position}
      />
      <HostCursorComponent
        position={cursorPosition}
        roomInfo={props.roomInfo}
      />
      <ToolbarComponent
        activeTool={activeTool}
        color={color}
        cursorWidth={cursorWidth}
        eraserWidth={eraserWidth}
        lineWidth={lineWidth}
        setActiveTool={setActiveTool}
        setColor={setColor}
        setCursorWidth={setCursorWidth}
        setEraserWidth={setEraserWidth}
        setLineWidth={setLineWidth}
      />
      {props.roomInfo.roomHostId === props.roomInfo.userId ? (
        <HostModeComponent
          activeTool={activeTool}
          canvasCtxTable={canvasCtxTable}
          color={color}
          cursorWidth={cursorWidth}
          eraserWidth={eraserWidth}
          isLectureStarted={props.isLectureStarted}
          isModifiedMode={props.isModifiedMode}
          layers={props.layers}
          lineWidth={lineWidth}
          modifiedLayers={props.modifiedLayers}
          roomInfo={props.roomInfo}
          roomUsers={props.roomUsers}
          socket={props.socket}
          topLayer={props.topLayer}
          setActiveTool={setActiveTool}
          setColor={setColor}
          setCursorWidth={setCursorWidth}
          setEraserWidth={setEraserWidth}
          setIsLectureStarted={props.setIsLectureStarted}
          setIsModifiedMode={props.setIsModifiedMode}
          setLineWidth={setLineWidth}
          setModifiedLayers={props.setModifiedLayers}
          setTopLayer={props.setTopLayer}
          layerContainerGridStyle={layerContainerGridStyle}
          setHidden={setHidden}
          setPosition={setPosition}
        />
      ) : (
        <GuestModeComponent
          activeTool={activeTool}
          canvasCtxTable={canvasCtxTable}
          color={color}
          copyModifiedCanvasSignal={props.copyModifiedCanvasSignal}
          cursorWidth={cursorWidth}
          eraserWidth={eraserWidth}
          isCompareMode={props.isCompareMode}
          isLectureStarted={props.isLectureStarted}
          isModifiedMode={props.isModifiedMode}
          layers={props.layers}
          lineWidth={lineWidth}
          modifiedLayers={props.modifiedLayers}
          roomInfo={props.roomInfo}
          roomUsers={props.roomUsers}
          socket={props.socket}
          topLayer={props.topLayer}
          setActiveTool={setActiveTool}
          setColor={setColor}
          setCopyModifiedCanvasSignal={props.setCopyModifiedCanvasSignal}
          setCursorWidth={setCursorWidth}
          setEraserWidth={setEraserWidth}
          setIsCompareMode={props.setIsCompareMode}
          setIsLectureStarted={props.setIsLectureStarted}
          setIsModifiedMode={props.setIsModifiedMode}
          setLineWidth={setLineWidth}
          setModifiedLayers={props.setModifiedLayers}
          setTopLayer={props.setTopLayer}
          layerContainerGridStyle={layerContainerGridStyle}
          setHidden={setHidden}
          setPosition={setPosition}
        />
      )}
    </>
  );
}

export default DrawComponent;
