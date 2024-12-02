// routes/dataRoutes.js
import express from 'express';
import { manageParticipant } from "../services/roomService.js";
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
  const roomParticipantData = roomDataStore.get(roomId);
  manageParticipant(roomId, roomParticipantData);
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

// Endpoint to delete a participant from a room
router.delete('/remove-participant', async (req, res) => {
  const { roomId, participantId } = req.body; // Extract values from request body

  // Debugging logs
  console.log('Room ID:', roomId); // Debug room ID
  console.log('Participant ID:', participantId); // Debug participant ID

  if (!roomId || !participantId) {
    return res.status(400).json({ error: 'Missing roomId or participantId in the request body.' });
  }

  try {
    const query = `
      WITH updated_data AS (
        SELECT sid,
               jsonb_agg(elem) AS new_room_data
        FROM rooms,
             jsonb_array_elements(room_data) elem
        WHERE sid = $1 -- Use parameterized queries to prevent SQL injection
          AND (elem->>'identity') != $2
        GROUP BY sid
      )
      UPDATE rooms
      SET room_data = updated_data.new_room_data
      FROM updated_data
      WHERE rooms.sid = updated_data.sid;


      -- Delete the room if room_data is empty after the update
      DELETE FROM rooms
      WHERE sid = $1
        AND room_data = '[]'::jsonb; -- Check if the room_data array is empty
    `;

    const result = await db.query(query, [roomId, participantId]); // Safely pass parameters

    // Check if rows were affected
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Room not found or no changes made.' });
    }

    res.status(200).json({
      message: `Participant ${participantId} successfully removed from room ${roomId}.`,
    });
  } catch (error) {
    console.error('Error managing participant:', error);
    res.status(500).json({ error: 'An error occurred while removing the participant.' });
  }
});


// export the router and roomDataStore]]]]]
export  { router as roomDataRoutes , roomDataStore };