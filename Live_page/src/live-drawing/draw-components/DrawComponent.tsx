import React, { useState, useEffect } from 'react';

import CursorComponent from './draw-cursor-components/components/CursorComponent';
import ToolbarComponent from './components/ToolbarComponent';
import HostModeComponent from './components/HostModeComponent';
import GuestModeComponent from './components/GuestModeComponent';

import { draw, erase } from './functions/draw-functions';
import {
  CanvasCtxTable,
  DrawComponentProps,
  DrawData,
  EraseData,
  Layer,
} from '../interfaces/draw-components-interfaces';
import { UserInfo } from '../interfaces/socket-interfaces';

function DrawComponent(props: DrawComponentProps) {
  //@ Drawing's States
  const [activeTool, setActiveTool] = useState<string>('');
  const [color, setColor] = useState('#000000');
  const [cursorWidth, setCursorWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(30);
  const [lineWidth, setLineWidth] = useState(5);
  const [canvasCtxTable, setCanvasCtxTable] = useState<CanvasCtxTable>({});

  //@ Connection's States
  const [pencilSignal, setPencilSignal] = useState<DrawData | null>(null);
  const [eraserSignal, setEraserSignal] = useState<EraseData | null>(null);
  const [newLayerCtxSignal, setNewLayerCtxSignal] = useState<number | null>(
    null,
  );
  const [historyFlag, setHistoryFlag] = useState<boolean>(true);

  //@ Function: Socket Connect Init
  useEffect(() => {
    if (!props.socket) return;
    props.socket.on('draw-pencil', (message: DrawData) =>
      setPencilSignal(message),
    );
    props.socket.on('draw-eraser', (message: EraseData) =>
      setEraserSignal(message),
    );
  }, [props.socket]);

  //@ Function: Recieve Pencil Event
  useEffect(() => {
    if (pencilSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[pencilSignal.canvasId];
    if (!canvasCtx) return;
    draw(pencilSignal, canvasCtx);
  }, [pencilSignal]);

  //@ Function: Recieve Eraser Event
  useEffect(() => {
    if (eraserSignal === null) return;
    const canvasCtx: CanvasRenderingContext2D =
      canvasCtxTable[eraserSignal.canvasId];
    if (!canvasCtx) return;
    erase(eraserSignal, canvasCtx);
  }, [eraserSignal]);

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
    props.setLayers([...newLayers]);
    setNewLayerCtxSignal(new Date().getTime());

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
        props.setModifiedLayers([...newLayers, ...newModifiedLayers]);
        break;

      case false:
        const newModifiedLayer: Layer = {
          username: `modified-${props.roomInfo.username}`,
          canvasId: `modified-${props.roomInfo.userId}`,
          buttonId: `modified-${props.roomInfo.userId}-button`,
          canvasCtx: null,
        };
        props.setModifiedLayers([...newLayers, newModifiedLayer]);
        break;
    }

    // 새로운 연결인 경우에는 history data 요청
    if (historyFlag && props.socket) {
      props.socket.emit('require-history');
      setHistoryFlag(false);
    }
  }, [props.roomUsers]);

  //@ layer가 생성되면, canvasContext를 가지고 있지 않은 layer를 찾아 연결
  useEffect(() => {
    // 마지막에 추가되는 canvas에 대해서 layers에 ctx 저장하기
    const layersLength: number = props.layers.length;
    if (layersLength === 0 || newLayerCtxSignal === null) return;

    const tmpCanvasCtxTable = { ...canvasCtxTable };
    const tmpLayers = [...props.layers];
    for (const layer of tmpLayers) {
      if (layer.canvasCtx) continue;

      const canvas: HTMLElement | null = document.getElementById(
        layer.canvasId,
      );
      if (!canvas) continue;

      const ctx: CanvasRenderingContext2D | null = (canvas as HTMLCanvasElement).getContext(
        '2d',
      );
      if (!ctx) continue;

      // layer와 CanvasCtxTable에 ctx 추가하기
      layer.canvasCtx = ctx;
      tmpCanvasCtxTable[layer.canvasId] = layer.canvasCtx;
    }
    props.setLayers(tmpLayers);
    setCanvasCtxTable(tmpCanvasCtxTable);
  }, [newLayerCtxSignal]);

  const layerContainerGridStyle =
    'w-full grid grid-cols-2 divide-x-4 divide-dashed divide-gray-300';

  return (
    <>
      <CursorComponent cursorWidth={cursorWidth} />
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
        />
      ) : (
        <GuestModeComponent
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
        />
      )}
    </>
  );
}

export default DrawComponent;
