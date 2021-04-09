import React, { useState } from 'react';

import GuestOriginLayerComponent from '../modified-mode-components/components/GuestOriginLayerComponent';
import GuestModifiedLayerComponent from '../modified-mode-components/components/GuestModifiedLayerComponent';

import { ModifiedModeComponentProps } from '../interfaces/modified-mode-interfaces';

function ModifiedModeComponent(props: ModifiedModeComponentProps) {
  return (
    <>
      {props.roomInfo.roomHostId === props.roomInfo.userId ? (
        <div className={props.layerContainerGridStyle}>
          <div className='cols-start-1 cols-end-2 relative'>
            <GuestOriginLayerComponent
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
              roomUsers={props.roomUsers}
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
              layerContainerGridStyle={props.layerContainerGridStyle}
            />
          </div>
          <div className='cols-start-2 cols-end-3 relative'>
            <GuestModifiedLayerComponent
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
              roomUsers={props.roomUsers}
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
              layerContainerGridStyle={props.layerContainerGridStyle}
            />
          </div>
        </div>
      ) : (
        <div className={props.layerContainerGridStyle}>
          <div className='cols-start-1 cols-end-2 relative'>
            <GuestModifiedLayerComponent
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
              roomUsers={props.roomUsers}
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
              layerContainerGridStyle={props.layerContainerGridStyle}
            />
          </div>
          <div className='cols-start-2 cols-end-3 relative'>
            <GuestOriginLayerComponent
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
              roomUsers={props.roomUsers}
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
              layerContainerGridStyle={props.layerContainerGridStyle}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default ModifiedModeComponent;
