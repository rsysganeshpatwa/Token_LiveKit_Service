import mongoose from 'mongoose';
import { Room, ApprovalRequest } from './src/models/roomModel.js';

// const mongoURI = 'mongodb://ec2-51-20-132-20.eu-north-1.compute.amazonaws.com:27017/videoconfrencing';
const mongoURI = 'mongodb://localhost:27017/';
// MongoDB Connection
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ==========================
// 🏠 Save or Update Room Data
// ==========================
export const saveRoomData = async (data) => {
  try {
    const room = await Room.findOneAndUpdate(
      { roomID: data.roomID }, // Find room by roomID
      { 
        $set: { 
          name: data.roomName.roomName, // Ensure you pass the value of roomName as a string
          participants: data.participants 
        }
      },
      { upsert: true, new: true } // Create if not exists, return updated
    );


    console.log('✅ Room data saved or updated successfully!',room);
    return room;
  } catch (err) {
    console.error('❌ Error saving or updating room data:', err);
  //  throw err; // Re-throw for handling at a higher level
  }
};

export const saveApprovalRequest = async (request) => {
  const approvalRequest = new ApprovalRequest(request);
  await approvalRequest.save();
  return approvalRequest;
};

export const updateApprovalRequest = async (id, status) => {
  try {
    // ✅ Find and update the request in MongoDB
    const request = await ApprovalRequest.findOneAndUpdate(
      { id: id },      // Find request by ID
      { status: status }, // Update status
      { new: true }      // Return the updated document
    );
  
    if (!request) {
      console.log('❌ Request not found');
      return null;
    }
    console.log(`✅ Updated Request:`, request);
    const formattedRequests = {
      id: request.id, // Assign sequential IDs starting from 4
      participantName: request.participantName,
      roomName: request.roomName, // Assuming roomName is stored in request.roomID
      status: request.status
    };
    return formattedRequests;
    } 
  catch (error) {
    console.error('❌ Error updating request:', error);
    return null;
  }
}

export const getAllApprovalRequestById = async (id) => {
  try {
    const request = await ApprovalRequest.findOne({ id: id }); // ✅ Correct query
    const formattedRequests = {
      id: request.id, // Assign sequential IDs starting from 4
      participantName: request.participantName,
      roomName: request.roomName, // Assuming roomName is stored in request.roomID
      status: request.status
    };
    return formattedRequests; // Return the data
  } catch (error) {
    console.error('Error fetching approval requests:', error);
  }
};

export const getApprovalRequests = async () => {
  try {
    const requests = await ApprovalRequest.find(); // ✅ Ensure `await` is used
    const formattedRequests = requests.map((request) => ({
      id: request.id, // Assign sequential IDs starting from 4
      participantName: request.participantName,
      roomName: request.roomName, // Assuming roomName is stored in request.roomID
      status: request.status
    }));
    return formattedRequests; // Return the data
  } catch (error) {
    console.error('Error fetching approval requests:', error);
  }
};


export const getAllRequest = async (roomName) => {
  try {
    const requests = await ApprovalRequest.find({ status: 'pending', roomName: roomName }); // ✅ Ensure `await` is used
    const formattedRequests = requests.map((request) => ({
      id: request.id, // Assign sequential IDs starting from 4
      participantName: request.participantName,
      roomName: request.roomName, // Assuming roomName is stored in request.roomID
      status: request.status
    }));
    return formattedRequests; // Return the data
  } catch (error) {
    console.error('Error fetching approval requests:', error);
  }
};

// ==========================
// 📜 Get Room Participant List
// ==========================
export const getRoomData = async (roomID,roomName) => {
  try {
    const room = await Room.findOne({ roomID }).lean(); // `lean()` improves performance for read operations
    if (!room) {
      console.log("⚠️ Room not found!");
      return null;
    }
    console.log("👥 Participants List:", room.participants);
    return room.participants;
  } catch (error) {
    console.error("❌ Error fetching room data:", error);
  }
};

// ==========================
// ❌ Remove Participant from Room
// ==========================
export const removeParticipant = async (roomID, participantID) => {
  try {
    const updatedRoom = await Room.findOneAndUpdate(
      { roomID }, // Find room by roomID
      { $pull: { participants: { _id: new mongoose.Types.ObjectId(participantID) } } }, // Remove participant by ID
      { new: true }
    );

    if (!updatedRoom) {
      console.log("⚠️ Room not found!");
      return null;
    }

    console.log(`✅ Participant ${participantID} removed from Room ${roomID}`);
    return updatedRoom;
  } catch (error) {
    console.error("❌ Error removing participant:", error);
  //  throw error;
  }
};


export const removeParticipantRequest = async (ID) => {
  console.log('🔍 Trying to delete request with ID:', ID);
  try {
    const result = await ApprovalRequest.deleteOne({ id: ID });
    console.log(result,"result");
    if (result.deletedCount > 0) {
      console.log('✅ Request deleted successfully');
    } else {
      console.log('⚠ No request found with the given ID');
    }
  } catch (error) {
    console.error("❌ Error removing participant:", error);
  }
};

