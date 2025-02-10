import express from 'express';
import ApprovalRequest from '../models/approvalRequest.js';
import { getAllRequest } from '../../db.js';

const router = express.Router();
// Get all pending requests
router.get('/pending-requests',  async (req, res) => {
  try {
    const { roomName } = req.query;

    if (!roomName) {
      return res.status(400).json({ message: 'Room name is required' });
    }
    const requests = await getAllRequest(roomName)
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Create a new approval request
router.post('/request-approval', async (req, res) => {
  const { participantName, roomName } = req.body;
  if (!participantName || !roomName) {
    return res.status(400).json({ message: 'Participant name and room name are required' });
  }

  try {
    const request = await ApprovalRequest.create(participantName, roomName);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject a request
router.post('/approve-request', async (req, res) => {
  const { requestId, approve } = req.body;
  if (!requestId || approve === undefined) {
    return res.status(400).json({ message: 'Request ID and approval status are required' });
  }

  try {
    const status = approve ? 'approved' : 'rejected';
    const request = await ApprovalRequest.update(requestId, status);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get request status
router.get('/request-status', async (req, res) => {
  const { requestId } = req.query;
  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required' });
  }

  try {
    const request = await ApprovalRequest.getById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a request
router.delete('/remove-request', async (req, res) => {
  const { requestId } = req.body;
  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required' });
  }

  try {
    await ApprovalRequest.removeById(requestId);
    res.json({ message: 'Request deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
