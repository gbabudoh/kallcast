import { AccessToken } from 'livekit-server-sdk';

if (!process.env.LIVEKIT_API_KEY || !process.env.LIVEKIT_API_SECRET || !process.env.LIVEKIT_URL) {
  throw new Error('LiveKit credentials are not set');
}

export interface LiveKitTokenParams {
  roomName: string;
  participantName: string;
  participantId: string;
  isOwner?: boolean;
}

export async function createLiveKitToken({
  roomName,
  participantName,
  participantId,
  isOwner = false,
}: LiveKitTokenParams) {
  const at = new AccessToken(
    process.env.LIVEKIT_API_KEY,
    process.env.LIVEKIT_API_SECRET,
    {
      identity: participantId,
      name: participantName,
    }
  );

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: isOwner,
  });

  return {
    token: await at.toJwt(),
    url: process.env.LIVEKIT_URL,
  };
}
