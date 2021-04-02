import { IAgoraRTCClient, ILocalAudioTrack } from 'agora-rtc-sdk-ng';

export interface Rtc {
  client: IAgoraRTCClient | null;
  localAudioTrack: ILocalAudioTrack | null;
  //   localAudioTrack: iaogra;
  //   IMicrophoneAudioTrack | null
}
