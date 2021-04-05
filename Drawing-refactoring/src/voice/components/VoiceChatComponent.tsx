import React, { useState, useEffect } from 'react';
import AgoraRTC, {
  IAgoraRTCClient,
  ILocalAudioTrack,
  IRemoteAudioTrack,
  UID,
} from 'agora-rtc-sdk-ng';
import { Rtc } from '../interfaces/voice-chat-interfaces';
import { TextComponent } from 'react-native';

const {
  RtcTokenBuilder,
  RtmTokenBuilder,
  RtcRole,
  RtmRole,
} = require('agora-access-token');

export function VoiceChatComponent(props: Rtc) {
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
  const [remotesignal, setRemoteSignal] = useState<boolean | null>(null);
  const [audiosignal, setAudiosignal] = useState<number | null>(null);
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
      if (user && mediaType === 'audio') {
        console.log('**********', user, mediaType);
        await client.subscribe(user, mediaType);
        console.log('!!!!!!!클라이언트의 리모트 유저스다!!!!!!!!!!');
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
    // 맨 처음 toggle값이 널일 때 여기로 들어가게 된다.
    console.log('==== check toggle speaker signal', toggleSpeakerSignal);
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
      // localAudioTrack.setEnabled(false);
      setMic(false);
    } else if (toggleMicSignal === true) {
      // localAudioTrack.setEnabled(true);
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
    console.log('!!!!!!!새로운 친구가 들어왔어요!!!!!!!!!!');
    console.log('친구들', client.remoteUsers);
    console.log('내 스피커 상황', speaker);
    console.log('내 마이크 상황', mic);
    console.log('토글 스피커 시그널', toggleSpeakerSignal);
    console.log('토글 마이크 시그널', toggleMicSignal);
  }, [newUserSignal]);

  useEffect(() => {
    const appID = `${process.env.REACT_APP_AGORA_APP_ID}`;
    const appCertificate = `${process.env.REACT_APP_AGORA_APP_CER}`;
    const channelName = `${process.env.REACT_APP_AGORA_CH_NAME}`;
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
      setUid(await client.join(appID, channelName, tokenA, null));
      setLocalAudiotrack(await AgoraRTC.createMicrophoneAudioTrack());
      setToggleSpeakerSignal(false);
      setSpeaker(false);
      setToggleMicSignal(false);
      setMic(false);
    }
    startBasicCall();
  }, []);

  return (
    <>
      {speaker ? (
        <p className={'icon-link center'}>
          <i
            className={'ri-2x ri-volume-up-line'}
            onClick={() => toggleSpeaker(!speaker)}
          ></i>
        </p>
      ) : (
        <p className={'icon-link center'}>
          <i
            className={'ri-2x ri-volume-mute-line'}
            onClick={() => toggleSpeaker(!speaker)}
          ></i>
        </p>
      )}

      {mic ? (
        <p className={'icon-link center'}>
          <i
            className={'ri-2x ri-mic-line'}
            onClick={() => toggleMic(!mic)}
          ></i>
        </p>
      ) : (
        <p className={'icon-link center'}>
          <i
            className={'ri-2x ri-mic-off-line'}
            onClick={() => toggleMic(!mic)}
          ></i>
        </p>
      )}
    </>
  );
}
export default VoiceChatComponent;
