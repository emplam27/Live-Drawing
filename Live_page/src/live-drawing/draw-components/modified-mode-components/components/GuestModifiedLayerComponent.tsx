import React, { useState } from 'react';

import { GuestModifiedLayerComponentProps } from '../interfaces/guest-modified-layer-component';

function GuestOriginLayerComponent(props: GuestModifiedLayerComponentProps) {
  return (
    <>
      <div>{props.modifiedTargetUser?.username} 학생 복사본 레이어</div>
    </>
  );
}

export default GuestOriginLayerComponent;
