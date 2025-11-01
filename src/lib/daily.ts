import Daily from '@daily-co/daily-js';

if (!process.env.DAILY_API_KEY) {
  throw new Error('DAILY_API_KEY is not set');
}

const daily = Daily.createClient({
  apiKey: process.env.DAILY_API_KEY,
});

export interface CreateRoomParams {
  name: string;
  maxParticipants: number;
  startTime?: Date;
  endTime?: Date;
  enableRecording?: boolean;
  enableChat?: boolean;
  enableScreenshare?: boolean;
}

export interface VideoRoom {
  id: string;
  name: string;
  url: string;
  config: {
    max_participants: number;
    nbf?: number;
    exp?: number;
    enable_recording?: boolean;
    enable_chat?: boolean;
    enable_screenshare?: boolean;
  };
}

export async function createRoom({
  name,
  maxParticipants,
  startTime,
  endTime,
  enableRecording = false,
  enableChat = true,
  enableScreenshare = true,
}: CreateRoomParams): Promise<VideoRoom> {
  const config: any = {
    max_participants: maxParticipants,
    enable_chat: enableChat,
    enable_screenshare: enableScreenshare,
    enable_recording: enableRecording,
  };

  // Set room availability window
  if (startTime) {
    config.nbf = Math.floor(startTime.getTime() / 1000);
  }
  if (endTime) {
    config.exp = Math.floor(endTime.getTime() / 1000);
  }

  const room = await daily.rooms.create({
    name,
    config,
  });

  return {
    id: room.id,
    name: room.name,
    url: room.url,
    config: room.config,
  };
}

export async function getRoom(roomId: string) {
  const room = await daily.rooms.get(roomId);
  return room;
}

export async function deleteRoom(roomId: string) {
  await daily.rooms.delete(roomId);
}

export async function createMeetingToken(
  roomName: string,
  userId: string,
  userName: string,
  isOwner: boolean = false
) {
  const token = await daily.meetingTokens.create({
    room_name: roomName,
    user_id: userId,
    user_name: userName,
    is_owner: isOwner,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
  });

  return token;
}

export async function getMeetingToken(tokenId: string) {
  const token = await daily.meetingTokens.get(tokenId);
  return token;
}

export async function deleteMeetingToken(tokenId: string) {
  await daily.meetingTokens.delete(tokenId);
}

export async function getRoomParticipants(roomName: string) {
  const participants = await daily.rooms.getParticipants(roomName);
  return participants;
}

export async function endRoom(roomName: string) {
  await daily.rooms.end(roomName);
}

export { daily };
