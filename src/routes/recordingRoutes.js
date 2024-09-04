import { Router } from 'express';
import { EgressClient } from 'livekit-server-sdk';
import { LIVEKIT_HOST, API_KEY, API_SECRET } from "../../config.js";

const router = Router();

const egressClient = new EgressClient(LIVEKIT_HOST, API_KEY, API_SECRET);

// Start a recording
router.post('/start-recording', async (req, res) => {
  const { roomName } = req.body;
  if (!roomName) {
    return res.status(400).send('Room name is required');
  }

  try {
    const recordingOptions = {
      room: roomName,
      outputFileName: 'recording.mp4',  // Specify the output file name
      // Add other recording options as needed
    };

    const recording = await egressClient.startRecording(recordingOptions);
    res.json({ recordingId: recording.id });
  } catch (error) {
    res.status(500).send(`Error starting recording: ${error.message}`);
  }
});

// Stop a recording
router.post('/stop-recording', async (req, res) => {
  const { recordingId } = req.body;
  if (!recordingId) {
    return res.status(400).send('Recording ID is required');
  }

  try {
    await egressClient.stopRecording(recordingId);
    res.send('Recording stopped');
  } catch (error) {
    res.status(500).send(`Error stopping recording: ${error.message}`);
  }
});

export default router;
