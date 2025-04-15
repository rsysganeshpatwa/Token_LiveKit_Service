import express from 'express';
const router = express.Router();
import egressController from '../controllers/egressController.js';

// Start YouTube stream
router.post('/start', egressController.startStream);

// Stop YouTube stream
router.post('/stop', egressController.stopStream);



// Get all streams
router.get('/list', egressController.getAllStreams);



export default router;