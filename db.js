import mongoose from 'mongoose';
import { Room, ApprovalRequest, Participant } from './src/models/roomModel.js';
import cleanupMongo from './src/utills/cleanupMongo.js';

  const mongoURI = 'mongodb://ec2-51-21-247-13.eu-north-1.compute.amazonaws.com:27017/videoconfrencing';
 //const mongoURI = 'mongodb://localhost:27017/videoconfrencing';


mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  maxPoolSize: 50,
  minPoolSize: 5,
  waitQueueTimeoutMS: 10000,
})
  .then(async () => {
    console.log('✅ MongoDB connected successfully')
    await cleanupMongo(); // Call the function to check and drop the bad index
  })
  .catch(err => console.error('❌ MongoDB connection error:', err));

export const upsertParticipants = async (participants, roomObjectId) => {
  try {
    const ops = participants
    .filter((p) => p.identity) // remove null, undefined, empty
    .map((p) => ({
      updateOne: {
        filter: { identity: p.identity, roomID: roomObjectId },
        update: { $set: { ...p, roomID: roomObjectId } },
        upsert: true,
      },
    }));

    const result = await Participant.bulkWrite(ops);
    console.log('✅ Participant upserts complete:', result);
    return result;
  } catch (err) {
    console.error('❌ Error in upsertParticipants:', err.message || err);
    return null;
  }
};

export const saveRoomData = async (data) => {
  try {
    console.log('data.roomName.roomName', data.roomName.roomName);
    console.log('data.roomID', data.roomID);
    console.log('participants:', JSON.stringify(data.participants));
    const room = await Room.findOneAndUpdate(
      { name: data.roomName.roomName },
      { $set: { roomID: data.roomID, name: data.roomName.roomName } },
      { upsert: true, new: true }
    );

  
    const result = await upsertParticipants(data.participants, room._id);
   // console.log('✅ Room data saved:', result);
    if (!result) {
      console.log('⚠️ No participants to save');
      return null;
    }
    return { room, result };
  } catch (err) {
    console.error('❌ Error in saveRoomData:', err.message || err);
    return null;
  }
};

export const saveApprovalRequest = async (request) => {
  const approvalRequest = new ApprovalRequest(request);
  await approvalRequest.save();
  return approvalRequest;
};

export const updateApprovalRequest = async (id, status) => {
  try {
    const request = await ApprovalRequest.findOneAndUpdate(
      { id: id },
      { status: status },
      { new: true }
    );

    if (!request) {
      console.log('❌ Request not found');
      return null;
    }
    console.log(`✅ Updated Request:`, request);
    return {
      id: request.id,
      participantName: request.participantName,
      roomName: request.roomName,
      status: request.status
    };
  } catch (error) {
    console.error('❌ Error updating request:', error);
    return null;
  }
};

export const getAllApprovalRequestById = async (id) => {
  try {
    const request = await ApprovalRequest.findOne({ id: id });
    return {
      id: request.id,
      participantName: request.participantName,
      roomName: request.roomName,
      status: request.status
    };
  } catch (error) {
    console.error('Error fetching approval requests:', error);
  }
};

export const getApprovalRequests = async () => {
  try {
    const requests = await ApprovalRequest.find();
    return requests.map((request) => ({
      id: request.id,
      participantName: request.participantName,
      roomName: request.roomName,
      status: request.status
    }));
  } catch (error) {
    console.error('Error fetching approval requests:', error);
  }
};

export const getAllRequest = async (roomName) => {
  try {
    const requests = await ApprovalRequest.find({ status: 'pending', roomName });
    return requests.map((request) => ({
      id: request.id,
      participantName: request.participantName,
      roomName: request.roomName,
      status: request.status
    }));
  } catch (error) {
    console.error('Error fetching approval requests:', error);
  }
};

export const getRoomData = async (roomID, roomName) => {
  try {
    const room = await Room.findOne({ name: roomName }).lean();
    if (!room) {
      console.log("⚠️ Room not found!");
      return null;
    }
    const participants = await Participant.find({ roomID: room._id });
    return participants;
  } catch (error) {
    console.error("❌ Error fetching room data:", error);
  }
};

export const deleteRoomData = async (roomID, roomName, participantId) => {
  try {
    const query = {};
    if (roomID) query.roomID = roomID;
    if (roomName) query.name = roomName;

    let room = await Room.findOne(query);
    if (!room) {
      console.log("⚠️ Room not found!");
      return null;
    }

    await Participant.deleteOne({ identity: participantId, roomID: room._id });
    const remaining = await Participant.find({ roomID: room._id });
    if (remaining.length === 0) {
      await Room.deleteOne({ _id: room._id });
      console.log(`🗑️ Room ${room.roomID} deleted as no participants left.`);
      return "Room deleted";
    }
    return "Participant removed";
  } catch (error) {
    console.error("❌ Error removing participant:", error);
  }
};

export const removeParticipantRequest = async (ID) => {
  try {
    const result = await ApprovalRequest.deleteOne({ id: ID });
    if (result.deletedCount > 0) {
      console.log('✅ Request deleted successfully');
    } else {
      console.log('⚠ No request found with the given ID');
    }
  } catch (error) {
    console.error("❌ Error removing participant:", error);
  }
};
