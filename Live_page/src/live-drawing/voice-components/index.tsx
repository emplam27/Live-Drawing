import React from 'react';
import VoiceToolComponent from './components/voiceTool';
// import { Rtc } from './interfaces/voice-component-props-interface';
// import {}

function VoiceChatComponent() {
  return (
    <div className='voiceContainer'>
      <VoiceToolComponent
        client={null}
        localAudioTrack={null}
        speaker={null}
        mic={null}
      ></VoiceToolComponent>
    </div>
  );
}
export default VoiceChatComponent;
