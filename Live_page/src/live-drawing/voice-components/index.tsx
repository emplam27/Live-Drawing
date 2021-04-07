import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  UID,
} from 'agora-rtc-sdk-ng';
// import { VoiceToolComponentProps } from './interfaces/voice-component-props-interface';

const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

// AgoraRTC.disableLogUpload();
AgoraRTC.setLogLevel(4);

function VoiceChatComponent() {
  const [speaker, setSpeaker] = useState<boolean | null>(null);
  const [mic, setMic] = useState<boolean | null>(null);
  const [toggleSpeakerSignal, setToggleSpeakerSignal] = useState<
    boolean | null
  >(null);
  const [toggleMicSignal, setToggleMicSignal] = useState<boolean | null>(null);

  const [
    localAudioTrack,
    setLocalAudiotrack,
  ] = useState<ILocalAudioTrack | null>(null);

  const { roomId } = useParams<{ roomId: string }>();
  const [newUserSignal, setNewUserSignal] = useState<number | null>(null);
  const [client, setClient] = useState<IAgoraRTCClient | null>(
    AgoraRTC.createClient({
      codec: 'vp8',
      mode: 'rtc',
    }),
  );
  const [uid, setUid] = useState<UID | number>(0);

  useEffect(() => {
    if (!localAudioTrack || !client) return;
    client.publish([localAudioTrack]);
    client.on('user-published', async (user, mediaType) => {
      // console.log('**********', user, mediaType);
      if (user && mediaType === 'audio') {
        await client.subscribe(user, mediaType);
        // console.log('!!!!!!!클라이언트의 리모트 유저스다!!!!!!!!!!');
        setNewUserSignal(new Date().getTime());
      }
    });
  }, [localAudioTrack]);

  function toggleSpeaker(speaker: boolean | null) {
    setToggleSpeakerSignal(speaker);
  }

  function toggleMic(mic: boolean | null) {
    setToggleMicSignal(mic);
  }

  /* 스피커 on/off */
  useEffect(() => {
    if (!client || toggleSpeakerSignal === null) return;
    if (toggleSpeakerSignal === false) {
      client.remoteUsers.forEach((user) => {
        user.audioTrack?.setVolume(0);
      });

      setSpeaker(false);
    } else if (toggleSpeakerSignal === true) {
      client.remoteUsers.forEach((user) => {
        user.audioTrack?.setVolume(100);
      });
      setSpeaker(true);
    }
  }, [toggleSpeakerSignal]);

  /* 마이크 조절 */
  useEffect(() => {
    if (!client || !localAudioTrack) return;
    if (toggleMicSignal === false || toggleMicSignal === null) {
      client.unpublish([localAudioTrack]);
      setMic(false);
    } else if (toggleMicSignal === true) {
      client.publish([localAudioTrack]);
      setMic(true);
    }
  }, [toggleMicSignal]);

  useEffect(() => {
    if (!client || !localAudioTrack || newUserSignal === null) return;
    client.remoteUsers.forEach((remoteUser) => {
      if (remoteUser.audioTrack) remoteUser.audioTrack.play();
      if (speaker === false) remoteUser.audioTrack?.setVolume(0);
    });
    if (mic === false) client.unpublish([localAudioTrack]);
    // console.log('친구들', client.remoteUsers);
    // console.log('내 스피커 상황', speaker);
    // console.log('내 마이크 상황', mic);
    // console.log('토글 스피커 시그널', toggleSpeakerSignal);
    // console.log('토글 마이크 시그널', toggleMicSignal);
  }, [newUserSignal]);

  useEffect(() => {
    const appID = `${process.env.REACT_APP_AGORA_APP_ID}`;
    const appCertificate = `${process.env.REACT_APP_AGORA_APP_CER}`;
    const channelName = roomId;
    const role = RtcRole.PUBLISHER;
    const expirationTimeInSeconds = 3600;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
    // IMPORTANT! Build token with either the uid or with the user account. Comment out the option you do not want to use below.
    // Build token with uid
    const tokenA = RtcTokenBuilder.buildTokenWithUid(
      appID,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs,
    ); // 0 uid

    async function startBasicCall() {
      if (!client) return;
      setLocalAudiotrack(await AgoraRTC.createMicrophoneAudioTrack());
      setUid(await client.join(appID, channelName, tokenA, null));
      setToggleSpeakerSignal(false);
      setSpeaker(false);
      setToggleMicSignal(false);
      setMic(false);
    }
    startBasicCall();
  }, []);

  const speakerButtonStyle =
    'flex justify-center items-center w-20 h-16 mt-2 mb-2 hover:text-blue-500';
  const micButtonStyle =
    'flex justify-center items-center w-20 h-16 mb-2 hover:text-blue-500';
  const activeStyle = 'text-blue-500 hover:text-blue-600';
  const inactiveStyle = 'text-gray-500 hover:text-blue-600';

  return (
    <>
      <div>
        {speaker ? (
          <div
            className={`${speakerButtonStyle} ${activeStyle}`}
            onClick={() => toggleSpeaker(!speaker)}
          >
            <i className={'ri-2x ri-volume-up-line'}></i>
          </div>
        ) : (
          <div
            className={`${speakerButtonStyle} ${inactiveStyle}`}
            onClick={() => toggleSpeaker(!speaker)}
          >
            <i className={'ri-2x ri-volume-mute-line'}></i>
          </div>
        )}

        {mic ? (
          <div
            className={`${micButtonStyle} ${activeStyle}`}
            onClick={() => toggleMic(!mic)}
          >
            <i className={'ri-2x ri-mic-line'}></i>
          </div>
        ) : (
          <div
            className={`${micButtonStyle} ${inactiveStyle}`}
            onClick={() => toggleMic(!mic)}
          >
            <i className={'ri-2x ri-mic-off-line'}></i>
          </div>
        )}
      </div>
    </>
  );
}

export default VoiceChatComponent;
