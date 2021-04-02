import React, { useState } from 'react';
import AgoraRTC, { IAgoraRTCClient } from 'agora-rtc-sdk-ng';
import { Rtc } from '../interfaces/voice-chat-interfaces';

function VoiceChatComponent() {
  console.log('voice chat component');
  const options = {
    // Pass your app ID here.
    appId: '0ebd36dbd3ed4d0bb0e3780173e3d4f7',
    // Set the channel name.
    channel: 'live',
    // Pass a token if your project enables the App Certificate.
    token:
      '0060ebd36dbd3ed4d0bb0e3780173e3d4f7IAAkeF1F2jgaRq0GFJbsvDkrpTEGw/wS596il2wg8elVy68sD1MAAAAAEABqNCIi2U1oYAEAAQDZTWhg',
  };

  const rtc: Rtc = {
    client: null,
    localAudioTrack: null,
  };
  // const [rtc.client, setClient] = useState(null);
  // const [localAudioTrack, setLocalAudioTrack] = useState(null);

  function voiceTest(rtc: Rtc) {
    console.log('voice test');

    async function startBasicCall() {
      console.log('start basic call');
      // 1. create a local client

      rtc.client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
      // 2. join a channnel
      const uid = await rtc.client.join(
        options.appId,
        options.channel,
        options.token,
        null,
      );

      // 3. Create and publish the local tracks
      rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      // Publish the local audio track to the channel.
      await rtc.client.publish([rtc.localAudioTrack]);

      console.log('publish success!');

      // 4. subscribe to a remote user
      rtc.client.on('user-published', async (user, mediaType) => {
        // Subscribe to a remote user.
        if (rtc.client) {
          await rtc.client.subscribe(user, mediaType);
          console.log('subscribe success');

          // If the subscribed track is audio.
          if (mediaType === 'audio') {
            // Get `RemoteAudioTrack` in the `user` object.
            const remoteAudioTrack = user.audioTrack;
            // Play the audio track. No need to pass any DOM element.
            if (remoteAudioTrack) {
              remoteAudioTrack.play();
            }
          }
        }
      });
    }
    startBasicCall();
  }
  async function leaveCall(rtc: Rtc) {
    console.log('leave call');
    if (rtc.localAudioTrack) {
      rtc.localAudioTrack.close();
    }
    // Leave the channel.
    if (rtc.client) {
      await rtc.client.leave();
    }
  }
  return (
    <>
      <button
        className='bg-gray-350 hover:bg-gray-300 text-white font-bold py-3 px-4 rounded'
        onClick={() => voiceTest(rtc)}
      >
        음성테스트
      </button>
      <button
        className='bg-gray-350 hover:bg-gray-300 text-white font-bold py-3 px-4 rounded'
        onClick={() => leaveCall(rtc)}
      >
        음성그만하기
      </button>
    </>
  );
}
export default VoiceChatComponent;
