// routes/dataRoutes.js
import express from 'express';
const router = express.Router();

// In-memory store for room data
const roomDataStore = new Map();

// Endpoint to set latest data for a room
router.post('/set-latest-data/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  const data = req.body.data;

  if (!data) {
    return res.status(400).json({ error: 'Data is required' });
  }

  // Store data for the specified roomId
  
    roomDataStore.set(roomId, data);
  
  roomDataStore.set(roomId, data);
  res.status(200).json({ message: 'Data updated successfully' });
});

// Endpoint to get the latest data for a room
router.get('/latest-data/:roomId/', (req, res) => {
  const roomId = req.params.roomId;
  const data = roomDataStore.get(roomId);

  if (data === undefined) {
    return res.status(404).json({ error: 'No data available for this room' });
  }

  res.status(200).json({ data });
});

// export the router and roomDataStore]]]]]
export  { router as roomDataRoutes , roomDataStore };