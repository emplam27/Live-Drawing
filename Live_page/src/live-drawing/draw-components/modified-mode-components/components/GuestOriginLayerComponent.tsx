import React, { useState } from 'react';

import { GuestOriginLayerComponentProps } from '../interfaces/guest-origin-layer-component';

function GuestOriginLayerComponent(props: GuestOriginLayerComponentProps) {
  return (
    <>
      <div>{props.modifiedTargetUser?.username} 학생 원본 레이어</div>
    </>
  );
}

export default GuestOriginLayerComponent;
