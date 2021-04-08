import React from 'react';

import { LayerGridComponentProps } from '../interfaces/layer-grid-interfaces';
import LectureModeComponent from './LectureModeComponent';
import ModifiedModeComponent from './ModifiedModeComponent';

function LayerGridComponent(props: LayerGridComponentProps) {
  return (
    <>
      {props.isModifiedMode ? (
        <ModifiedModeComponent
          activeTool={props.activeTool}
          canvasCtxTable={props.canvasCtxTable}
          color={props.color}
          cursorWidth={props.cursorWidth}
          eraserWidth={props.eraserWidth}
          isModifiedMode={props.isModifiedMode}
          layers={props.layers}
          lineWidth={props.lineWidth}
          modifiedLayers={props.modifiedLayers}
          modifiedTargetUser={props.modifiedTargetUser}
          roomInfo={props.roomInfo}
          socket={props.socket}
          topLayer={props.topLayer}
          setActiveTool={props.setActiveTool}
          setColor={props.setColor}
          setCursorWidth={props.setCursorWidth}
          setEraserWidth={props.setEraserWidth}
          setIsModifiedMode={props.setIsModifiedMode}
          setLineWidth={props.setLineWidth}
          setModifiedTargetUser={props.setModifiedTargetUser}
          setModifiedLayers={props.setModifiedLayers}
          setTopLayer={props.setTopLayer}
        />
      ) : (
        <LectureModeComponent
          activeTool={props.activeTool}
          canvasCtxTable={props.canvasCtxTable}
          color={props.color}
          cursorWidth={props.cursorWidth}
          eraserWidth={props.eraserWidth}
          isModifiedMode={props.isModifiedMode}
          layers={props.layers}
          lineWidth={props.lineWidth}
          modifiedLayers={props.modifiedLayers}
          modifiedTargetUser={props.modifiedTargetUser}
          roomInfo={props.roomInfo}
          socket={props.socket}
          topLayer={props.topLayer}
          setActiveTool={props.setActiveTool}
          setColor={props.setColor}
          setCursorWidth={props.setCursorWidth}
          setEraserWidth={props.setEraserWidth}
          setIsModifiedMode={props.setIsModifiedMode}
          setLineWidth={props.setLineWidth}
          setModifiedTargetUser={props.setModifiedTargetUser}
          setModifiedLayers={props.setModifiedLayers}
          setTopLayer={props.setTopLayer}
        />
      )}
    </>
  );
}

export default LayerGridComponent;
