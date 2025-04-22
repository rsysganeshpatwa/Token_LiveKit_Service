// routes/webhook.js
import express from 'express';
import { WebhookReceiver } from 'livekit-server-sdk';
const router = express.Router();
import { API_KEY, API_SECRET } from "../../config.js";
import {deleteRoomData} from "../../db.js"


// Replace with your actual LiveKit API key and secret
const receiver = new WebhookReceiver(API_KEY, API_SECRET);

router.post('/', async (req, res) => {
  try {
    const authHeader = req.get('Authorization');
    const event = await receiver.receive(req.body, authHeader);

    console.log(`✅ Valid webhook received: ${event.event}`);

    switch (event.event) {
      case 'participant_left':
        console.log(`👤 ${event.participant.identity} joined room ${event.room.name}`);
        deleteRoomData(event.room.roomId,event.room.name,event.participant.identity);

        break;
      case 'room_finished':
        console.log(`🛑 Room finished: ${event.room.name}`);
        break;
      default:
        console.log(`📦 Other event: ${event.event}`);
        break;
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Invalid webhook:', err);
    res.status(400).send('Invalid webhook');
  }
});

export default router;
