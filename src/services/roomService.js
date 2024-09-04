import { RoomServiceClient } from "livekit-server-sdk";
import { LIVEKIT_HOST, API_KEY, API_SECRET } from "../../config.js";

const svc = new RoomServiceClient(LIVEKIT_HOST, API_KEY, API_SECRET);

export const listRooms = async () => {
  return await svc.listRooms();
};
