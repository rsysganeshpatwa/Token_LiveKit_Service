import express from 'express';
import ApprovalRequest from '../models/approvalRequest.js';

const router = express.Router();
// Get all pending requests
router.get('/pending-requests', (req, res) => {
  try {
    const requests = ApprovalRequest.getAll().filter(req => req.status === 'pending');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new approval request
router.post('/request-approval', (req, res) => {
  const { participantName, roomName } = req.body;
  if (!participantName || !roomName) {
    return res.status(400).json({ message: 'Participant name and room name are required' });
  }

  try {
    const request = ApprovalRequest.create(participantName, roomName);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve or reject a request
router.post('/approve-request', (req, res) => {
  const { requestId, approve } = req.body;
  if (!requestId || approve === undefined) {
    return res.status(400).json({ message: 'Request ID and approval status are required' });
  }

  try {
    const status = approve ? 'approved' : 'rejected';
    const request = ApprovalRequest.update(requestId, status);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get request status
router.get('/request-status', (req, res) => {
  const { requestId } = req.query;
  if (!requestId) {
    return res.status(400).json({ message: 'Request ID is required' });
  }

  try {
    const request = ApprovalRequest.getById(parseInt(requestId, 10));
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
