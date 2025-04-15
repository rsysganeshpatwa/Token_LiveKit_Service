import mongoose from 'mongoose';

// Define participant schema
const participantSchema = new mongoose.Schema({
  identity: { type: String, required: true },
  roomID: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  isAudioEnable: { type: Boolean, required: true },
  isVideoEnable: { type: Boolean, required: true },
  isHandRaised: { type: Boolean, required: true },
  isTalkToHostEnable: { type: Boolean, required: true },
  handRaisedTimeStamp: { type: Number, required: true },
  role: { type: String, required: true },
});

participantSchema.index({ identity: 1, roomID: 1 }, { unique: true }); // Composite unique index
// Export Participant model
const Participant = mongoose.model('Participant', participantSchema);
export { Participant };

// Define room schema
const roomSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Ensure unique room names
  roomID: { type: String, required: true, unique: true }, // Ensure unique room IDs
  createdAt: { type: Date, default: Date.now }, // Automatically set the creation date
});

// Create a compound unique index (ensures unique participants within the same room)
roomSchema.index({ "roomID": 1, "name": 1 }, { unique: true }); // Ensures both roomID and room name are unique

// Create the Room model
const Room = mongoose.model('Room', roomSchema);
export { Room };

// Counter schema for auto-increment
const counterSchema = new mongoose.Schema({
  name: String,
  seq: { type: Number, default: 0 },
});

export const Counter = mongoose.model("Counter", counterSchema);

// Define the schema for approval requests
const approvalRequestSchema = new mongoose.Schema({
  id: Number,
  participantName: { type: String, required: true },
  roomName: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});
// Create the ApprovalRequest model
const ApprovalRequest = mongoose.model('ApprovalRequest', approvalRequestSchema);
export { ApprovalRequest };
