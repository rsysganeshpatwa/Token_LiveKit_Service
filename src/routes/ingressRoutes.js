import express from 'express';
import { IngressClient, IngressInput } from 'livekit-server-sdk';
import Ingress from '../models/Ingress.js';
import { API_KEY, API_SECRET, LIVEKIT_HOST_INGRESS } from "../../config.js";
import { saveRoomData } from '../../db.js';
import { deleteRoomData } from '../../db.js';

const router = express.Router();
const ingressClient = new IngressClient(LIVEKIT_HOST_INGRESS, API_KEY, API_SECRET);

// GET: Fetch all ingress streams
router.get('/get-streams', async (req, res) => {
    try {
        //const ingressList = await Ingress.find(); // Fetch all ingress records
        const ingressList = await ingressClient.listIngress();
        const formattedList = ingressList.map(ingress => ({
            name: ingress.name,
            input_type: ingress.inputType,
            roomName: ingress.roomName,
            participant_identity: ingress.participantIdentity,
            participant_name: ingress.participantName,
            stream_url: ingress.url || "N/A",
            stream_key: ingress.streamKey || "N/A",
            ingress_id: ingress.ingressId
        }));
        res.status(200).json(formattedList);
    } catch (error) {
        console.error('Error fetching ingress list:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST: Create a new ingress stream
router.post('/post-stream', async (req, res) => {
    try {
        const { name, input_type, roomName, participant_identity, participant_name } = req.body;

        // Validate required fields
        if (!name || !input_type || !roomName || !participant_identity || !participant_name) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Fetch the list of existing ingresses
        const existingIngresses = await ingressClient.listIngress();

        // Check if an ingress with the same roomName already exists
        const isDuplicateIngress = existingIngresses.some(ingress => ingress.roomName === roomName);
        if (isDuplicateIngress) {
            return res.status(400).json({ message: `Ingress for room "${roomName}" already exists.` });
        }

        // Determine the input type based on req.body.input_type
        // Default to RTMP if not specified otherwise
        let ingressInputType = IngressInput.RTMP_INPUT;
        if (input_type.toUpperCase() === 'WHIP') {
            ingressInputType = IngressInput.WHIP_INPUT;
        }

        // Prepare ingress configuration
        const ingressConfig = {
            name,
            roomName: roomName,
            participantIdentity: participant_identity,
            participantName: participant_name,
            // Set enableTranscoding based on input type
            enableTranscoding: ingressInputType !== IngressInput.WHIP_INPUT,
            // Add URLs if needed
            url: LIVEKIT_HOST_INGRESS,
        };

        // Create the ingress using the SDK
        const ingressInfo = await ingressClient.createIngress(ingressInputType, ingressConfig);

        // Extract stream URL and key from the response
        const stream_url = ingressInfo.url || "N/A";
        const stream_key = ingressInfo.streamKey || "N/A";

        const responseData = {
            name,
            input_type,
            //roomName,
            roomName: { roomName },
            participant_identity,
            participant_name,
            stream_url: ingressInfo.url || "N/A",
            stream_key: ingressInfo.streamKey || "N/A",
            ingress_id: ingressInfo.ingressId,
            participants: [
                {
                    identity: participant_identity,
                    isAudioEnable: true,
                    isVideoEnable: true,
                    isHandRaised: false,
                    isTalkToHostEnable: true,
                    handRaisedTimeStamp: 0,
                    role: "Role.admin",
                },
            ],
        };

        saveRoomData(responseData); // Save room data to MongoDB
        return res.status(200).json(responseData);
    } catch (error) {
        console.error('Error creating ingress:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/delete-stream/:roomName', async (req, res) => {
    try {
        const { roomName } = req.params;
        
        if (!roomName) {
            return res.status(400).json({ message: 'Room name is required' });
        }
        
        // First, get all ingress streams to find those matching the roomName
        const ingressList = await ingressClient.listIngress();
        
        // Filter ingress entries by roomName
        const matchingIngresses = ingressList.filter(ingress => 
            ingress.roomName === roomName
        );
        
        if (matchingIngresses.length === 0) {
            return res.status(404).json({ message: `No ingress found for room: ${roomName}` });
        }
        
        // Delete all matching ingress streams
        const deletePromises = matchingIngresses.map(async (ingress) => {
            console.log(`Deleting ingress ID: ${ingress.ingressId} for room: ${roomName}`);
            await ingressClient.deleteIngress(ingress.ingressId);
            return ingress.ingressId;
        });
        
        const deletedIds = await Promise.all(deletePromises);

        // Return success response with deleted IDs
        return res.status(200).json({ 
            message: `Successfully deleted ${deletedIds.length} ingress stream(s) for room: ${roomName}`,
            deleted_ingress_ids: deletedIds
        });
        
    } catch (error) {
        console.error('Error deleting ingress:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

export default router;