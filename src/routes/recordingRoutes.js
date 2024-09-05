// recordingRoutes.js
import express from 'express';
const router = express.Router();
import { startRecording, stopRecording } from '../services/egressService.js';

let egressId = null; // Store the egress ID

// Route to start recording
router.post('/start', async (req, res) => {
    const { roomName } = req.body;
    try {
        const response = await startRecording(roomName);
        egressId = response.egressId; // Store the egress ID
        res.status(200).json({ message: 'Recording started', egressId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to start recording' });
    }
});

// Route to stop recording
router.post('/stop', async (req, res) => {
    try {
        if (!egressId) {
            return res.status(400).json({ error: 'No recording in progress' });
        }
        const response = await stopRecording(egressId);
        egressId = null; // Reset egress ID
        res.status(200).json({ message: 'Recording stopped' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to stop recording' });
    }
});

export default router;
