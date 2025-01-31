import mongoose from 'mongoose';
import { Room } from './src/models/roomModel.js';

// const mongoURI = 'mongodb+srv://VideoConfrecing:Z45MHxYS7VKjWRpa@videoconfrencing.bmdz7.mongodb.net/?retryWrites=true&w=majority&appName=VideoConfrencing';
const mongoURI = 'mongodb://ec2-51-20-132-20.eu-north-1.compute.amazonaws.com/:27017/';

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
  //  throw error;
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
