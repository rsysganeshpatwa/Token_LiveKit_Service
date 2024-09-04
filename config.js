import dotenv from "dotenv";

dotenv.config();

export const API_KEY = process.env.livekitLocalAPIKey;
export const API_SECRET = process.env.livekitLocalSecret;
export const LIVEKIT_HOST = process.env.livekitLocalURL;
