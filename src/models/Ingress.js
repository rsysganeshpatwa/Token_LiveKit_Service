import mongoose from 'mongoose';

const IngressSchema = new mongoose.Schema({
    name: String,
    input_type: String,
    roomName: String,
    participant_identity: String,
    participant_name: String,
    stream_url: String,
    stream_key: String
}, { timestamps: true });

export default mongoose.model('Ingress', IngressSchema);