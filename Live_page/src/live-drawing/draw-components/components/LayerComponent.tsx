import React, { useState, useEffect } from 'react';

import PeersLayerComponent from './PeersLayerComponent';
import MyLayerComponent from './MyLayerComponent';
import '../index.css';

import { Layer } from '../../interfaces/draw-components-interfaces';
import { LayerComponentProps } from '../interfaces/layer-interfaces';
import { UserInfo } from '../../interfaces/socket-interfaces';

function LayerComponent(props: LayerComponentProps) {
  const [activeTool, setActiveTool] = useState<string>('');
  const [color, setColor] = useState('#000000');
  const [eraserWidth, setEraserWidth] = useState(30);
  const [lineWidth, setLineWidth] = useState(5);
  const [historyFlag, setHistoryFlag] = useState<boolean>(true);

  //@ roomData가 업데이트 될 때마다 layers를 재구성, layer 추가&삭제 역할수행
  useEffect(() => {
    // console.log(props.roomUsers);
    if (props.roomUsers === null || props.roomUsers.users === undefined) return;

    const newLayers = props.roomUsers.users.map((user: UserInfo) => {
      const newLayer: Layer = {
        name: user.userName,
        canvasId: user.userId,
        buttonId: `${user.userId}-button`,
        canvasCtx: null,
      };
      return newLayer;
    });

    // 호스트이면 본인을 제외한 아무 레이어 선택, 게스트이면 호스트 레이어 선택
    if (props.topLayer === null && props.roomUsers.users.length > 1) {
      let targetLayer: Layer = newLayers[0];
      if (props.roomInfo.hostId === props.roomInfo.userId) {
        console.log('난 호스트');
        const tmp = newLayers.find((layer: Layer) => {
          props.roomInfo.userId !== layer.canvasId;
        });
        console.log('게스트 레이어가 있음?', tmp);
        if (tmp) targetLayer = tmp;
      } else {
        console.log('난 호스트가 아니야');
        const tmp = newLayers.find((layer: Layer) => {
          props.roomInfo.hostId === layer.canvasId;
        });
        console.log('호스트 레이어가 있음?', tmp);
        if (tmp) targetLayer = tmp;
      }
      props.setTopLayer(targetLayer);
    }

    props.setLayers(newLayers);
    props.setNewLayerCtxSignal(new Date().getTime());

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
    if (layersLength === 0 || props.newLayerCtxSignal === null) return;

    const tmpCanvasCtxTable = { ...props.canvasCtxTable };
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
    props.setCanvasCtxTable(tmpCanvasCtxTable);
  }, [props.newLayerCtxSignal]);

  return (
    <>
      <div id='canvasContainer' className='w-full grid grid-cols-2 divide-x-2'>
        <div className='cols-start-1 cols-end-2 relative'>
          {props.layers.length > 1 ? (
            <PeersLayerComponent
              activeTool={activeTool}
              canvasCtxTable={props.canvasCtxTable}
              color={color}
              eraserWidth={eraserWidth}
              layers={props.layers}
              lineWidth={lineWidth}
              roomInfo={props.roomInfo}
              socket={props.socket}
              topLayer={props.topLayer}
            />
          ) : (
            <div> 아무도 없어요</div>
          )}
        </div>
        <div className='cols-start-2 cols-end-3 relative'>
          <MyLayerComponent
            activeTool={activeTool}
            canvasCtxTable={props.canvasCtxTable}
            color={color}
            cursorWidth={props.cursorWidth}
            eraserWidth={eraserWidth}
            lineWidth={lineWidth}
            roomInfo={props.roomInfo}
            socket={props.socket}
            topLayer={props.topLayer}
            setActiveTool={setActiveTool}
            setColor={setColor}
            setCursorWidth={props.setCursorWidth}
            setEraserWidth={setEraserWidth}
            setLineWidth={setLineWidth}
          />
        </div>
      </div>
    </>
  );
}

export default LayerComponent;
