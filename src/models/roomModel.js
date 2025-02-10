// models/roomModel.js

import mongoose from 'mongoose';

// Define participant schema
const participantSchema = new mongoose.Schema({
  identity: { type: String, required: true },
  isAudioEnable: { type: Boolean, required: true },
  isVideoEnable: { type: Boolean, required: true },
  isHandRaised: { type: Boolean, required: true },
  isTalkToHostEnable: { type: Boolean, required: true },
  handRaisedTimeStamp: { type: Number, required: true },
  role: { type: String, required: true }
});

// Define room schema
const roomSchema = new mongoose.Schema({
  roomID: { type: String, required: true },
  name: { type: String, required: true },  // Add this field for room name
  participants: [participantSchema]
});

// Create the Room model
const Room = mongoose.model('Room', roomSchema);

// Export the Room model using ES Modules syntax
export { Room };

const counterSchema = new mongoose.Schema({
    name: String,
    seq: { type: Number, default: 0 }
});

export const Counter = mongoose.model("Counter", counterSchema);

// Define the schema for approval requests
const approvalRequestSchema = new mongoose.Schema({
  id: Number, 
  participantName: { type: String, required: true },
//   roomID: { type: String, required: true },
  roomName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});
// Create the ApprovalRequest model
const ApprovalRequest = mongoose.model('ApprovalRequest', approvalRequestSchema);
export { ApprovalRequest };
