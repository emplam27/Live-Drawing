import { IAgoraRTCClient, ILocalAudioTrack } from 'agora-rtc-sdk-ng';

export interface VoiceToolComponentProps {
  client: IAgoraRTCClient | null;
  localAudioTrack: ILocalAudioTrack | null;
  speaker: boolean | null;
  mic: boolean | null;
}
