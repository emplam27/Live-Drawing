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
  // 토큰 생성 및 방 참여
  const [speaker, setSpeaker] = useState(true);
  const [mic, setMic] = useState(true);
  const [toggleSpeakerSignal, setToggleSpeakerSignal] = useState<
    boolean | null
  >(null);
  const [toggleMicSignal, setToggleMicSignal] = useState<boolean | null>(null);
  const [
    localAudioTrack,
    setLocalAudiotrack,
  ] = useState<ILocalAudioTrack | null>(null);
  const [
    remoteAudioTrack,
    setRemoteAudioTrack,
  ] = useState<IRemoteAudioTrack | null>(null);

  const [audiosignal, setAudiosignal] = useState<number | null>(null);
  const [clientsignal, setClientSignal] = useState<boolean | null>(null);
  const [client, setClient] = useState<IAgoraRTCClient | null>(
    AgoraRTC.createClient({
      codec: 'vp8',
      mode: 'rtc',
    }),
  );

  const [uid, setUid] = useState<UID | number>(0);

  useEffect(() => {
    const appID = '0ebd36dbd3ed4d0bb0e3780173e3d4f7';
    const appCertificate = 'dd5dd9f77a9a413e88dfb7eb13e4ad54';
    const channelName = 'live';
    // const uid = 0; // 사용자 ID 인증하지 않음
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
    // console.log('Token With Integer Number Uid: ' + tokenA);

    async function startBasicCall() {
      if (!client) return;
      setUid(await client.join(appID, channelName, tokenA, null));
      setLocalAudiotrack(await AgoraRTC.createMicrophoneAudioTrack());
    }
    startBasicCall();
    // console.log('publish success!', user);
  }, []);

  useEffect(() => {
    if (!localAudioTrack || !client) return;

    client.publish([localAudioTrack]);
    console.log('published');

    client.on('user-published', async (user, mediaType) => {
      if (client) {
        await client.subscribe(user, mediaType);
        // Get `RemoteAudioTrack` in the `user` object.
        const remoteAudioTrack = user.audioTrack;
        // Play the audio track. No need to pass any DOM element.if (mediaType === "audio") {
        if (remoteAudioTrack) {
          remoteAudioTrack.play();
          remoteAudioTrack.on;
          console.log('remote audio track');
        }
      }
    });
  }, [localAudioTrack]);

  async function toggleSpeaker(speaker) {
    setToggleSpeakerSignal(speaker);
  }

  async function toggleMic(mic) {
    setToggleMicSignal(mic);
  }
  /* 스피커 조절 : 다른 사람들 목소리 안들리게 */

  useEffect(() => {
    console.log('speaker', speaker, localAudioTrack);
    if (!localAudioTrack) return;
    if (speaker === true) {
      console.log('remote audio track', remoteAudioTrack);
      if (localAudioTrack !== null) {
        localAudioTrack.setVolume(0);
        localAudioTrack.stop();
        setSpeaker(false);
        console.log('volume down');
      }
    } else {
      if (speaker === false) {
        localAudioTrack.setVolume(100);
        localAudioTrack.play();
        setSpeaker(true);
        console.log('volume up');
      }
    }
  }, [toggleSpeakerSignal]);

  /* 마이크 조절 */
  useEffect(() => {
    if (toggleMicSignal === null) return;
    if (mic === true && client !== null && localAudioTrack !== null) {
      localAudioTrack.setEnabled(false);
      client.unpublish([localAudioTrack]);
      localAudioTrack.stop();
      setMic(false);
      console.log('mic off', mic);
    } else {
      if (mic === false && client !== null && localAudioTrack !== null) {
        localAudioTrack.setEnabled(true);
        client.publish([localAudioTrack]);
        localAudioTrack.play();
        setMic(true);
        console.log('mic on', mic);
      }
    }
    console.log('toggle mic', localAudioTrack);
  }, [toggleMicSignal]);

  return (
    <>
      {speaker ? (
        <p className={'icon-link center'}>
          <i
            className={'ri-2x ri-volume-up-line'}
            onClick={() => toggleSpeaker(speaker)}
          ></i>
        </p>
      ) : (
        <p className={'icon-link center'}>
          <i
            className={'ri-2x ri-volume-mute-line'}
            onClick={() => toggleSpeaker(speaker)}
          ></i>
        </p>
      )}

      {mic ? (
        <p className={'icon-link center'}>
          <i className={'ri-2x ri-mic-line'} onClick={() => toggleMic(mic)}></i>
        </p>
      ) : (
        <p className={'icon-link center'}>
          <i
            className={'ri-2x ri-mic-off-line'}
            onClick={() => toggleMic(mic)}
          ></i>
        </p>
      )}
    </>
  );
}
export default VoiceChatComponent;
