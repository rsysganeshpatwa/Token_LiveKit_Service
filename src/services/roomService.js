import { RoomServiceClient } from "livekit-server-sdk";
import { LIVEKIT_HOST, API_KEY, API_SECRET } from "../../config.js";
import { roomDataStore} from "../routes/roomDataRoutes.js";

const svc = new RoomServiceClient(LIVEKIT_HOST, API_KEY, API_SECRET);

export const listRooms = async () => {

  const list = await svc.listRooms()
 
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
