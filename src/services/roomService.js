import { RoomServiceClient } from "livekit-server-sdk";
import { LIVEKIT_HOST, API_KEY, API_SECRET } from "../../config.js";
import { roomDataStore} from "../routes/roomDataRoutes.js";
import { query } from "../services/db.js";

const svc = new RoomServiceClient(LIVEKIT_HOST, API_KEY, API_SECRET);

export const listRooms = async () => {

  console.log("roomDataStore", svc);
  const list = await svc.listRooms()
  console.log("roomDataStore", roomDataStore);

  try{
  // delete data from roomDataStore when room is not found in list
   if(list.length === 0){
     roomDataStore.clear();
     return list;
   }
   if(roomDataStore.size === 0){
     return  list;
   }


  const roomIds = list.map((room) => room.sid);
  const dataKeys = Array.from(roomDataStore.keys());
  dataKeys.forEach((key) => {
    if (!roomIds.includes(key)) {
      roomDataStore.delete(key);
    }
  });
}
catch(error){   
  console.log("Error fetching rooms",`${error.message}`);
}



  return  list;
};



export const manageParticipant = async (roomId, roomData) => {
  const sid = roomId;
  const name = roomId; // Assuming roomId is used as the name

  const seen = new Set();
  const uniqueData = roomData.filter(participant => {
    if (seen.has(participant.identity)) {
      return false;  // Skip if the identity has already been encountered
    }
    seen.add(participant.identity);  // Add identity to the set
    return true;  // Keep the participant in the result
  });
  const room_data = JSON.stringify(uniqueData); // Convert to JSON string

  try {
    await query(
      `
      INSERT INTO rooms (sid, name, room_data)
      VALUES ($1, $2, $3)
      ON CONFLICT (sid) DO UPDATE SET
        name = EXCLUDED.name,
        room_data = EXCLUDED.room_data;
      `,
      [sid, name, room_data]
    );

    console.log('Room successfully inserted or updated!');
  } catch (error) {
    console.error('Error managing participant:', error);
    throw error;
  }
};