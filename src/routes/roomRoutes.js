import express from "express";
import { listRooms } from "../services/roomService.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const rooms = await listRooms();
    //console.log("rooms", rooms);
     // Get all approval requests
     const allRequests = approvalRequests.getAll();

     // Extract room names from the approval requests
     const requestRoomNames = allRequests.map(req => req.roomName);
 
     // Extract room names from the room list
     const availableRoomNames = rooms.map(room => room.name); // Adjust property based on your room object structure
 
     // Determine which room names are not available in the room list
     const roomsNotAvailable = requestRoomNames.filter(name => !availableRoomNames.includes(name));
 
     // Clear approval requests for rooms that are not found
     roomsNotAvailable.forEach(name => approvalRequests.clearByRoom(name));
     console.log(`Cleared approval requests for rooms not available: ${roomsNotAvailable.join(', ')}`);
 
    res.send(rooms);
  } catch (error) {

    res.status(500).send("Error fetching rooms",`${error.message}`);
  }
});

export default router;
