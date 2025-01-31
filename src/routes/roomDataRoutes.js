// routes/dataRoutes.js
import express from 'express';
const router = express.Router();
import { getRoomData, saveRoomData }  from '../../db.js'; // Adjust the path as needed
// export { getRoomData, saveRoomData, removeParticipant };

// In-memory store for room data
const roomDataStore = new Map();

// Endpoint to set latest data for a room
router.post('/set-latest-data/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const roomName = req.query;
  const data = req.body.data;
  if (!data) {
    return res.status(400).json({ error: 'Data is required' });
  }       
  // Store data for the specifiesd roomId
  // roomDataStore.set(roomId, data);
  // // Prepare the data to be saved
  const roomData = {
    roomID: roomId,
    participants: data,
    roomName: roomName
  };

  // Call the saveRoomData function
  saveRoomData(roomData);
  res.status(200).json({ message: 'Data updated successfully' });
});

// Endpoint to get the latest data for a room
router.get('/latest-data/:roomId/', async (req, res) => {
  const roomId = req.params.roomId;
  const roomName = req.query.roomName;
  const data = await getRoomData(roomId,roomName);
  if (data === undefined) {
    return res.status(404).json({ error: 'No data available for this room' });
  }
  res.status(200).json({ data });
});

// export the router and roomDataStore]]]]]
export  { router as roomDataRoutes , roomDataStore };