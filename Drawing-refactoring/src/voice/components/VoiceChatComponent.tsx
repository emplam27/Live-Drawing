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
  const [speaker, setSpeaker] = useState<boolean | null>(false);
  const [mic, setMic] = useState<boolean | null>(false);

  const [toggleSpeakerSignal, setToggleSpeakerSignal] = useState<
    boolean | null
  >(null);
  const [toggleMicSignal, setToggleMicSignal] = useState<boolean | null>(null);

  const [
    localAudioTrack,
    setLocalAudiotrack,
  ] = useState<ILocalAudioTrack | null>(null);
  const [remoteAudioTracks, setRemoteAudioTracks] = useState<
    IRemoteAudioTrack[]
  >([]);

  const [remotesignal, setRemoteSignal] = useState<boolean | null>(null);
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
    if (!localAudioTrack || !client) return;
    client.publish([localAudioTrack]);
    client.on('user-published', async (user, mediaType) => {
      await client.subscribe(user, mediaType);
      console.log('!!!!!!!새로 들어왔어요!!!!!!!!!!', remoteAudioTracks);
      console.log('!!!!!!!클라이언트의 리모트 유저스다!!!!!!!!!!');
      client.remoteUsers.forEach((remoteUser) => {
        console.log('================1==', speaker, mic, remoteUser.audioTrack);
        if (remoteUser.audioTrack) remoteUser.audioTrack.play();
        console.log(
          '================2===',
          speaker,
          mic,
          remoteUser.audioTrack,
        );
        if (speaker === false) remoteUser.audioTrack?.setVolume(0);
        // 스피커가 false면 volume 0 으로
      });
      // 마이크가 false면 unpublish
      if (mic === false) client.unpublish([localAudioTrack]);
    });
  }, [localAudioTrack]);

  function toggleSpeaker(speaker: boolean | null) {
    setToggleSpeakerSignal(speaker);
    console.log('!!!!!!!!!!!!!speaker!!!!!!!!!!!!!', speaker);
  }

  function toggleMic(mic: boolean | null) {
    setToggleMicSignal(mic);
    console.log('!!!!!!!!!!!!!mic!!!!!!!!!!!!!!', mic);
  }
  useEffect(() => {
    remoteAudioTracks.forEach((remoteAudioTrack) => {
      if (speaker === true) {
        remoteAudioTrack.setVolume(100);
      } else {
        remoteAudioTrack.setVolume(0);
      }
    });
  }, [remoteAudioTracks]);

  /* 스피커 on/off */
  useEffect(() => {
    if (!remoteAudioTracks || toggleSpeakerSignal === null) return;
    if (speaker === true || speaker == null) {
      remoteAudioTracks.forEach((remoteAudioTrack) => {
        // remoteAudioTrack.setVolume(0);
        remoteAudioTrack.play();
        // stop을 풀 때 다른 사람들의 이벤트를 듣게해야해
      });
      setSpeaker(false);
    } else if (speaker === false) {
      remoteAudioTracks.forEach((remoteAudioTrack) => {
        // remoteAudioTrack.setVolume(100);
        remoteAudioTrack.stop();
      });
      setSpeaker(true);
    }
  }, [toggleSpeakerSignal]);

  /* 마이크 조절 */
  useEffect(() => {
    if (!client || !localAudioTrack || toggleMicSignal === null) return;
    if (mic === true || mic == null) {
      client.unpublish([localAudioTrack]);
      // localAudioTrack.setEnabled(false);
      setMic(false);
    } else if (mic === false) {
      // localAudioTrack.setEnabled(true);
      client.publish([localAudioTrack]);
      setMic(true);
    }
  }, [toggleMicSignal]);

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
      setSpeaker(false);
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
